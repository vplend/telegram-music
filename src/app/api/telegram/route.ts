import { NextResponse } from "next/server";
import { Telegraf } from "telegraf";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { execFile } from "child_process";



const unlinkAsync = promisify(fs.unlink);
const execFileAsync = promisify(execFile);

// Инициализация Telegram-бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

async function downloadAudio(url: string, tempOutput: string, retries = 3) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const platform = os.platform();
            const ytDlpPath = path.join(
                process.cwd(),
                "bin",
                platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
            );
            const args = [
                "--update",
                "-x",
                "--audio-format",
                "mp3",
                "--audio-quality",
                "5",
                "--user-agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "--add-header",
                "Accept:*/*",
                "--add-header",
                "Accept-Language:en-US,en;q=0.9",
                "--add-header",
                "Sec-Fetch-Mode:navigate",
                "--retries",
                "3",
                "--fragment-retries",
                "3",
                "--skip-unavailable-fragments",
                "-o",
                tempOutput,
                url,
            ];

            const { stdout, stderr } = await execFileAsync(ytDlpPath, args, {
                timeout: 300000,
            });

            if (!fs.existsSync(tempOutput)) {
                throw new Error("Файл не был скачан");
            }
            return path.basename(tempOutput);
        } catch (err: unknown) {
            if (attempt === retries) throw err;
            await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
        }
    }
    throw new Error("Не удалось скачать аудио после нескольких попыток");
}

export async function POST(req: Request) {
    let tempOutput: string | undefined = undefined;

    try {
        const { url, name, artist, icon, chatId, songId } = await req.json();

        console.log("📥 Telegram API: New request", { url, name, artist, chatId, songId });
        
        if (!chatId) {
            console.error("❌ Telegram API: No chat_id provided");
            return NextResponse.json(
                { ok: false, error: "No chat_id" },
                { status: 400 }
            );
        }
        if (!url) {
            console.error("❌ Telegram API: Invalid YouTube URL");
            return NextResponse.json(
                { ok: false, error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        const tmpDir = os.tmpdir();
        const timestamp = Date.now();
        tempOutput = path.join(tmpDir, `${name || "audio"}_${timestamp}.mp3`);

        console.log("⬇️ Starting download:", url);
        await downloadAudio(url, tempOutput);
        console.log("✅ Download completed:", tempOutput);

        let thumbBuffer: Buffer | undefined;
        if (icon) {
            try {
                console.log("🖼️ Fetching thumbnail:", icon);
                const res = await fetch(icon);
                if (res.ok) {
                    const arrayBuffer = await res.arrayBuffer();
                    thumbBuffer = Buffer.from(arrayBuffer);
                    console.log("✅ Thumbnail loaded");
                } else {
                    console.warn(`⚠️ Failed to fetch thumbnail: ${res.status}`);
                }
            } catch (e) {
                console.error("❌ Error fetching thumbnail:", e);
            }
        }
        
        console.log("📤 Sending audio to Telegram, chatId:", chatId);

        await bot.telegram.sendAudio(
            chatId.toString(),
            {
                source: fs.createReadStream(tempOutput),
                filename: `${name}.mp3`,
            },
            {
                title: name,
                performer: artist,
                caption: `[Подробнее о треке](https://t.me/SmipMusicBot/info?startapp=${songId})`,
                parse_mode: "MarkdownV2",
                ...(thumbBuffer ? { thumb: { source: thumbBuffer } } : {}),

            }
        );
        console.log("✅ Audio sent successfully to Telegram");

        return NextResponse.json({ ok: true, filename: path.basename(tempOutput) });
    } catch (err: unknown) {
        console.error("❌ Error in /api/telegram:", err);

        let errorMessage = "Unknown error occurred";
        let statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
            console.error("Error details:", {
                message: err.message,
                stack: err.stack,
                name: err.name
            });
            
            // Специфические ошибки
            if (err.message.includes("ENOENT")) {
                errorMessage = "yt-dlp not found or file system error";
                statusCode = 500;
                console.error("💥 File system error or yt-dlp not found");
            } else if (err.message.includes("timeout")) {
                errorMessage = "Download timeout exceeded";
                statusCode = 504;
                console.error("⏱️ Timeout exceeded");
            } else if (err.message.includes("Invalid YouTube URL")) {
                errorMessage = "Invalid or unavailable YouTube video";
                statusCode = 400;
                console.error("🚫 Invalid YouTube URL");
            } else if (err.message.includes("Telegram")) {
                errorMessage = "Failed to send audio to Telegram";
                statusCode = 502;
                console.error("📱 Telegram API error");
            } else if (err.message.includes("403") || err.message.includes("Forbidden")) {
                errorMessage = "Access denied or video is private";
                statusCode = 403;
                console.error("🔒 Access denied");
            }
        }

        return NextResponse.json(
            {
                ok: false,
                error: errorMessage,
            },
            { status: statusCode }
        );
    } finally {
        if (tempOutput && fs.existsSync(tempOutput)) {
            try {
                await unlinkAsync(tempOutput);
                console.log("🗑️ Temp file deleted:", tempOutput);
            } catch (e) {
                console.error("❌ Failed to delete temp file:", e);
            }
        }
    }
}

/**
 * API-роут для скачивания аудио с YouTube и отправки в Telegram через yt-dlp
 * POST /api/telegram
 * Принимает: { url, name, artist, icon, chatId }
 */
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
        const { url, name, artist, icon, chatId, geniusUrl } = await req.json();
        if (!chatId) {
            return NextResponse.json(
                { ok: false, error: "No chat_id" },
                { status: 400 }
            );
        }
        if (!url) {
            return NextResponse.json(
                { ok: false, error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        const tmpDir = os.tmpdir();
        const timestamp = Date.now();
        tempOutput = path.join(tmpDir, `${name || "audio"}_${timestamp}.mp3`);

        await downloadAudio(url, tempOutput);

        let thumbBuffer: Buffer | undefined;
        if (icon) {
            try {
                const res = await fetch(icon);
                if (res.ok) {
                    const arrayBuffer = await res.arrayBuffer();
                    thumbBuffer = Buffer.from(arrayBuffer);
                } else {
                }
            } catch (e) {
            }
        }
        await bot.telegram.sendAudio(
            chatId.toString(),
            {
                source: fs.createReadStream(tempOutput),
                filename: `${name}.mp3`,
            },
            {
                title: name,
                performer: artist,
                ...(thumbBuffer ? { thumb: { source: thumbBuffer } } : {}),
            }
        );

        return NextResponse.json({ ok: true, filename: path.basename(tempOutput) });
    } catch (err: unknown) {
        return NextResponse.json(
            {
                ok: false,
                error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 }
        );
    } finally {
        if (tempOutput && fs.existsSync(tempOutput)) {
            try {
                await unlinkAsync(tempOutput);
            } catch (e) {
            }
        }
    }
}

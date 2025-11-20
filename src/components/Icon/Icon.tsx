import Image from "next/image"
import { Root } from "../Root/Root"
import './style.css'

interface IconProps {
    icon: 'add_circle_fill' | 'ellipsis_vertical',
    width: number,
    height: number,

}

export default function Icon({ icon, width, height }: IconProps) {
    return (
        <div className="icon">
            <svg style={{ display: 'none' }}>
                <symbol id="add_circle_fill" viewBox="0 0 24 24" width="24" height="24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12.9 7C12.9 6.50294 12.4971 6.1 12 6.1C11.5029 6.1 11.1 6.50294 11.1 7V11.1H7C6.50294 11.1 6.1 11.5029 6.1 12C6.1 12.4971 6.50294 12.9 7 12.9H11.1V17C11.1 17.4971 11.5029 17.9 12 17.9C12.4971 17.9 12.9 17.4971 12.9 17V12.9H17C17.4971 12.9 17.9 12.4971 17.9 12C17.9 11.5029 17.4971 11.1 17 11.1H12.9V7Z" fill="currentColor" />
                </symbol>
            </svg>
            <svg style={{ display: 'none' }}>
                <symbol id="ellipsis_vertical" viewBox="0 0 24 24" width="24" height="24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0006 8.00145C13.1007 8.00145 14.0007 7.10145 14.0007 6.00145C14.0007 4.90145 13.1007 4.00145 12.0006 4.00145C10.9005 4.00145 10.0005 4.90145 10.0005 6.00145C10.0005 7.10145 10.9005 8.00145 12.0006 8.00145ZM12.0006 10.0015C10.9005 10.0015 10.0005 10.9015 10.0005 12.0015C10.0005 13.1015 10.9005 14.0015 12.0006 14.0015C13.1007 14.0015 14.0007 13.1015 14.0007 12.0015C14.0007 10.9015 13.1007 10.0015 12.0006 10.0015ZM10.0005 18.0015C10.0005 16.9015 10.9005 16.0015 12.0006 16.0015C13.1007 16.0015 14.0007 16.9015 14.0007 18.0015C14.0007 19.1015 13.1007 20.0015 12.0006 20.0015C10.9005 20.0015 10.0005 19.1015 10.0005 18.0015Z" fill="currentColor" />
                </symbol>
            </svg>

            <svg viewBox="0 0 24 24" width={width} height={height}><use href={`#${icon}`} /></svg>
        </div>
    )
}
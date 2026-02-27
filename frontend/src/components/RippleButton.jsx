/**
 * RippleButton.jsx
 * Drop-in button with click ripple effect.
 * Props: all standard <button> props + style/className.
 */
import { useRef } from "react";

export default function RippleButton({
    children,
    onClick,
    style = {},
    className = "",
    disabled = false,
    ...rest
}) {
    const btnRef = useRef(null);

    const handleClick = (e) => {
        if (disabled) return;

        const btn = btnRef.current;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.4;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement("span");
        ripple.className = "ripple-circle";
        ripple.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${x}px;
      top:    ${y}px;
    `;
        btn.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());

        onClick?.(e);
    };

    return (
        <button
            ref={btnRef}
            onClick={handleClick}
            disabled={disabled}
            className={`ripple-btn ${className}`}
            style={{
                fontFamily: "'Orbitron', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                ...style,
            }}
            {...rest}
        >
            {children}
        </button>
    );
}

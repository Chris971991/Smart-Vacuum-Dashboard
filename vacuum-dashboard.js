/**
 * Alfonso Robot Vacuum Dashboard Card for Home Assistant
 * A comprehensive vacuum monitoring dashboard with matching Irrigation Dashboard design
 *
 * Version: 2.0.0 - Complete Rewrite with All Features
 * Author: Custom built for Alfonso (Ecovacs Deebot X2 Omni) robot vacuum
 *
 * Features:
 * - Matching design language from lawn-irrigation-dashboard
 * - 4-tab interface (Rooms, Schedule, Settings, Maintenance)
 * - Interactive map with clickable room zones
 * - Room cleaning history tracking
 * - Maintenance alerts with ordering reminders
 * - Adaptive context-aware controls
 * - Battery charging status with ETA
 * - Do Not Disturb / Schedule override
 * - Error history tracking
 *
 * Installation:
 * 1. Copy this file to your Home Assistant config/www/community/vacuum-dashboard/ folder
 * 2. Add as a resource in Dashboard settings:
 *    URL: /local/community/vacuum-dashboard/vacuum-dashboard.js
 *    Type: JavaScript Module
 * 3. Refresh your browser (Ctrl+Shift+R)
 * 4. Add the card to your dashboard using the YAML configuration
 */

const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;
const svg = LitElement.prototype.svg || html; // svg template tag, fallback to html

// ============================================
// PHASE 1: STYLES WITH ANIMATIONS
// ============================================

const cardStyles = css`
  :host {
    --vac-bg-primary: linear-gradient(145deg, #1a1f2e 0%, #0f1419 100%);
    --vac-bg-page: linear-gradient(180deg, #0a0e14 0%, #111827 100%);
    --vac-bg-card: rgba(255,255,255,0.03);
    --vac-border: rgba(255,255,255,0.08);
    --vac-border-hover: rgba(255,255,255,0.15);
    --vac-text-primary: #F9FAFB;
    --vac-text-secondary: #9CA3AF;
    --vac-text-muted: #6B7280;
    --vac-text-dim: #4B5563;
    --vac-accent-green: #22C55E;
    --vac-accent-yellow: #F59E0B;
    --vac-accent-red: #EF4444;
    --vac-accent-blue: #3B82F6;
    --vac-accent-purple: #A855F7;
    --vac-accent-cyan: #06B6D4;
    --vac-accent-orange: #F97316;
    --vac-accent-pink: #EC4899;
  }

  * {
    box-sizing: border-box;
  }

  /* ==========================================
     ANIMATIONS
     ========================================== */

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes pulse-scale {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(255,255,255,0.5); }
    50% { box-shadow: 0 0 16px rgba(255,255,255,0.8), 0 0 24px rgba(59, 130, 246, 0.5); }
  }

  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce-in {
    0% { transform: scale(0.9); opacity: 0; }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(5px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px) rotate(-1deg); }
    75% { transform: translateX(2px) rotate(1deg); }
  }

  @keyframes wave {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  @keyframes vacuum-move {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(3px) rotate(2deg); }
    50% { transform: translateX(0) rotate(0deg); }
    75% { transform: translateX(-3px) rotate(-2deg); }
  }

  @keyframes cleaning-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
      transform: scale(1.02);
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes bar-fill {
    0% { transform: scaleX(0); transform-origin: left; }
    100% { transform: scaleX(1); transform-origin: left; }
  }

  @keyframes charging-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  @keyframes charging-bolt {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.5)); }
    50% { transform: scale(1.1); filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.8)); }
  }

  @keyframes slide-up {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(2.5); opacity: 0; }
  }

  @keyframes slide-down {
    0% { opacity: 0; max-height: 0; transform: translateY(-10px); }
    100% { opacity: 1; max-height: 1000px; transform: translateY(0); }
  }

  @keyframes expand-in {
    0% { opacity: 0; transform: scaleY(0.95); transform-origin: top; }
    100% { opacity: 1; transform: scaleY(1); transform-origin: top; }
  }

  @keyframes scale-in {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes toggle-bounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }

  @keyframes chip-pop {
    0% { transform: scale(1); }
    50% { transform: scale(0.92); }
    100% { transform: scale(1); }
  }

  @keyframes row-highlight {
    0% { background: rgba(59, 130, 246, 0.2); }
    100% { background: transparent; }
  }

  /* ==========================================
     BASE STYLES
     ========================================== */

  .dashboard {
    min-height: 100vh;
    background: var(--vac-bg-page);
    padding: 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: fade-in 0.5s ease-out;
  }

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .panel {
    background: var(--vac-bg-primary);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid var(--vac-border);
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .panel:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .panel-title {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--vac-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-title-icon {
    font-size: 16px;
  }

  /* ==========================================
     HEADER
     ========================================== */

  .header {
    margin-bottom: 24px;
    padding: 24px;
    animation: bounce-in 0.6s ease-out;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .header-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--vac-text-primary);
    letter-spacing: -0.03em;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-title-icon {
    font-size: 32px;
    display: inline-block;
    animation: wave 2s ease-in-out infinite;
  }

  .header-title-icon.cleaning {
    animation: vacuum-move 0.5s ease-in-out infinite;
  }

  .header-subtitle {
    margin: 8px 0 0 0;
    color: var(--vac-text-muted);
    font-size: 14px;
  }

  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .header-badges {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-badge.docked {
    background: rgba(34, 197, 94, 0.15);
    color: var(--vac-accent-green);
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .status-badge.cleaning {
    background: rgba(59, 130, 246, 0.15);
    color: var(--vac-accent-blue);
    border: 1px solid rgba(59, 130, 246, 0.3);
    animation: cleaning-pulse 2s ease-in-out infinite;
  }

  .status-badge.returning {
    background: rgba(249, 115, 22, 0.15);
    color: var(--vac-accent-orange);
    border: 1px solid rgba(249, 115, 22, 0.3);
  }

  .status-badge.error {
    background: rgba(239, 68, 68, 0.15);
    color: var(--vac-accent-red);
    border: 1px solid rgba(239, 68, 68, 0.3);
    animation: shake 0.3s ease-in-out infinite;
  }

  .status-badge.paused {
    background: rgba(245, 158, 11, 0.15);
    color: var(--vac-accent-yellow);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .status-badge.idle {
    background: rgba(107, 114, 128, 0.15);
    color: var(--vac-text-secondary);
    border: 1px solid rgba(107, 114, 128, 0.3);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .status-badge.cleaning .status-dot,
  .status-badge.error .status-dot {
    animation: pulse-scale 1s infinite;
  }

  .mop-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(6, 182, 212, 0.15);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 16px;
    font-size: 11px;
    color: var(--vac-accent-cyan);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .mop-badge-icon {
    font-size: 14px;
  }

  .battery-display {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 12px;
  }

  .battery-icon-wrapper {
    position: relative;
    font-size: 24px;
  }

  .battery-icon-wrapper.charging .battery-bolt {
    animation: charging-bolt 1.5s ease-in-out infinite;
  }

  .battery-bolt {
    position: absolute;
    top: -2px;
    right: -6px;
    font-size: 12px;
  }

  .battery-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .battery-percent {
    font-size: 18px;
    font-weight: 700;
    color: var(--vac-text-primary);
  }

  .battery-percent.low {
    color: var(--vac-accent-red);
  }

  .battery-percent.medium {
    color: var(--vac-accent-yellow);
  }

  .battery-percent.high {
    color: var(--vac-accent-green);
  }

  .battery-status {
    font-size: 10px;
    color: var(--vac-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .battery-status.charging {
    color: var(--vac-accent-green);
    animation: charging-pulse 1.5s ease-in-out infinite;
  }

  /* Cleaning stats indicator when active */
  .cleaning-indicator {
    width: 100%;
    margin-top: 16px;
    padding: 16px 24px;
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.13), rgba(59, 130, 246, 0.13));
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.27);
    position: relative;
    overflow: hidden;
  }

  .cleaning-indicator::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }

  .cleaning-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    position: relative;
    z-index: 1;
  }

  .cleaning-stat {
    text-align: center;
  }

  .cleaning-stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--vac-accent-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .cleaning-stat-label {
    font-size: 11px;
    color: var(--vac-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-top: 4px;
  }

  .pulse-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--vac-accent-blue);
    animation: pulse-scale 1s infinite;
    box-shadow: 0 0 10px var(--vac-accent-blue);
  }

  /* Last run info */
  .last-run-info {
    margin-top: 12px;
    padding: 12px 16px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    font-size: 13px;
    color: var(--vac-text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .last-run-icon {
    font-size: 16px;
  }

  .last-run-text {
    flex: 1;
  }

  .last-run-time {
    color: var(--vac-text-primary);
    font-weight: 500;
  }

  .last-run-rooms {
    color: var(--vac-text-muted);
    font-size: 12px;
  }

  /* ==========================================
     MAIN LAYOUT - REDESIGNED
     ========================================== */

  .main-layout {
    display: grid;
    grid-template-columns: 500px 1fr;
    gap: 24px;
  }

  @media (max-width: 1200px) {
    .main-layout {
      grid-template-columns: 1fr;
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ==========================================
     HEADER QUICK ACTIONS (Compact in header)
     ========================================== */

  .header-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .header-action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--vac-text-secondary);
    font-size: 12px;
    font-weight: 600;
  }

  .header-action-btn:hover {
    background: rgba(255,255,255,0.06);
    transform: translateY(-1px);
    border-color: var(--vac-border-hover);
  }

  .header-action-btn.primary {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
    color: var(--vac-accent-green);
  }

  .header-action-btn.primary:hover {
    background: rgba(34, 197, 94, 0.25);
  }

  .header-action-btn.primary.cleaning {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
    color: var(--vac-accent-blue);
  }

  .header-action-btn.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .header-action-btn .action-emoji {
    font-size: 16px;
  }

  /* Old action-button styles (kept for compatibility) */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  @media (max-width: 768px) {
    .quick-actions {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 480px) {
    .quick-actions {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 12px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .action-button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
  }

  .action-button:hover {
    background: rgba(255,255,255,0.06);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border-color: var(--vac-border-hover);
  }

  .action-button:hover::after {
    transform: translate(-50%, -50%) scale(2);
  }

  .action-button:active {
    transform: translateY(0);
  }

  .action-button.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .action-button.primary {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .action-button.primary:hover {
    background: rgba(34, 197, 94, 0.2);
  }

  .action-button.primary.cleaning {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .action-icon {
    font-size: 28px;
    transition: transform 0.2s ease;
  }

  .action-button:hover .action-icon {
    transform: scale(1.1);
  }

  .action-icon.start { color: var(--vac-accent-green); }
  .action-icon.pause { color: var(--vac-accent-orange); }
  .action-icon.resume { color: var(--vac-accent-green); }
  .action-icon.stop { color: var(--vac-accent-red); }
  .action-icon.dock { color: var(--vac-accent-blue); }
  .action-icon.locate { color: var(--vac-accent-purple); }

  .action-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--vac-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .action-sublabel {
    font-size: 9px;
    color: var(--vac-text-muted);
    margin-top: -4px;
  }

  /* ==========================================
     QUICK PRESETS
     ========================================== */

  .presets-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .presets-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
  }

  .preset-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 20px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    color: var(--vac-text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .preset-chip:hover {
    background: rgba(255,255,255,0.08);
    transform: translateY(-2px);
    border-color: var(--vac-border-hover);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .preset-chip:active {
    transform: scale(0.95);
  }

  .preset-chip.active {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.4);
    color: var(--vac-accent-green);
  }

  .preset-chip.bedrooms {
    --preset-color: var(--vac-accent-purple);
  }
  .preset-chip.bedrooms:hover, .preset-chip.bedrooms.active {
    background: rgba(168, 85, 247, 0.15);
    border-color: rgba(168, 85, 247, 0.4);
    color: var(--vac-accent-purple);
  }

  .preset-chip.living {
    --preset-color: var(--vac-accent-blue);
  }
  .preset-chip.living:hover, .preset-chip.living.active {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
    color: var(--vac-accent-blue);
  }

  .preset-chip.bathrooms {
    --preset-color: var(--vac-accent-cyan);
  }
  .preset-chip.bathrooms:hover, .preset-chip.bathrooms.active {
    background: rgba(6, 182, 212, 0.15);
    border-color: rgba(6, 182, 212, 0.4);
    color: var(--vac-accent-cyan);
  }

  .preset-chip.kitchen {
    --preset-color: var(--vac-accent-orange);
  }
  .preset-chip.kitchen:hover, .preset-chip.kitchen.active {
    background: rgba(249, 115, 22, 0.15);
    border-color: rgba(249, 115, 22, 0.4);
    color: var(--vac-accent-orange);
  }

  .preset-chip-icon {
    font-size: 14px;
  }

  .preset-chip-count {
    font-size: 10px;
    opacity: 0.7;
    margin-left: 2px;
  }

  /* ==========================================
     VACUUM MAP
     ========================================== */

  .map-panel {
    position: relative;
  }

  .map-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
    /* Let image determine aspect ratio naturally - no forced stretching */
  }

  .map-image {
    width: 100%;
    height: auto;
    display: block;
    /* Use contain to preserve image aspect ratio - no stretching */
  }

  .map-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--vac-text-muted);
    gap: 12px;
  }

  .map-placeholder-icon {
    font-size: 48px;
    opacity: 0.5;
  }

  .map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  .map-overlay.interactive {
    /* SVG container itself doesn't catch events - only child polygons do */
    pointer-events: none;
  }

  /* In edit mode, SVG needs to catch clicks for drawing */
  .map-container.edit-mode .map-overlay.interactive {
    pointer-events: auto;
    z-index: 10;
  }

  .map-room-zone {
    /* DEBUG: Bright red to verify polygons are rendering */
    fill: rgba(255, 0, 0, 0.4);
    stroke: yellow;
    stroke-width: 2;
    cursor: pointer;
    transition: all 0.2s ease;
    /* Polygons catch all pointer events within their bounds */
    pointer-events: all;
  }

  .map-room-zone:hover,
  .map-room-zone.hovered {
    /* Subtle highlight on hover to indicate clickable area */
    fill: rgba(255, 255, 255, 0.08);
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 1;
  }

  .map-room-zone.selected {
    /* Green highlight when room is selected for cleaning */
    fill: rgba(34, 197, 94, 0.2);
    stroke: rgba(34, 197, 94, 0.5);
    stroke-width: 2;
  }

  .map-room-zone.selected:hover,
  .map-room-zone.selected.hovered {
    fill: rgba(34, 197, 94, 0.3);
    stroke: rgba(34, 197, 94, 0.7);
  }

  /* Room labels - only show when hovered or selected */
  .map-room-label {
    fill: var(--vac-text-primary);
    font-size: 8px;
    font-weight: 600;
    text-anchor: middle;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5);
  }

  .map-room-zone:hover + .map-room-label,
  .map-room-zone.hovered + .map-room-label,
  .map-room-zone.selected + .map-room-label {
    opacity: 1;
  }

  /* ==========================================
     MAP EDITOR MODE
     ========================================== */

  .map-container.edit-mode {
    cursor: crosshair;
  }

  /* HTML-based grid overlay (SVG grid gets distorted by preserveAspectRatio) */
  .map-edit-grid-html {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  .map-edit-grid-html .grid-line {
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
  }

  .map-edit-grid-html .grid-line.vertical {
    width: 1px;
    height: 100%;
    top: 0;
  }

  .map-edit-grid-html .grid-line.horizontal {
    width: 100%;
    height: 1px;
    left: 0;
  }

  .map-edit-grid-html .grid-line.major {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Legacy SVG grid styles */
  .map-edit-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.3;
  }

  .map-edit-grid line {
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 0.5;
  }

  .map-edit-grid line.major {
    stroke: rgba(255, 255, 255, 0.4);
    stroke-width: 1;
  }

  /* SVG edit points - kept for fallback but may be distorted */
  .map-edit-point-svg {
    fill: var(--vac-accent-blue);
    stroke: white;
    stroke-width: 0.5;
    cursor: grab;
    transition: all 0.15s ease;
    pointer-events: auto;
  }

  /* HTML-based edit points layer */
  .map-edit-points-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 15;
    pointer-events: none;
  }

  .edit-point {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #3B82F6;
    border: 3px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
    pointer-events: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    color: white;
  }

  .edit-point:hover {
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow: 0 3px 12px rgba(0,0,0,0.6);
  }

  .edit-point.first {
    background: #F97316;
    width: 24px;
    height: 24px;
  }

  .edit-point.closeable {
    background: #22C55E;
    width: 28px;
    height: 28px;
    cursor: pointer;
    animation: pulse-green 1s ease-in-out infinite;
    font-size: 14px;
  }

  .edit-point.closeable:hover {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
  }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
  }

  .map-edit-polygon {
    fill: rgba(0, 255, 0, 0.5);
    stroke: lime;
    stroke-width: 3;
    stroke-dasharray: none;
    pointer-events: none;
  }

  .map-edit-polygon.complete {
    stroke-dasharray: none;
    fill: rgba(34, 197, 94, 0.25);
    stroke: var(--vac-accent-green);
  }

  .map-edit-line {
    stroke: var(--vac-accent-blue);
    stroke-width: 0.5;
    stroke-dasharray: 2, 2;
    pointer-events: none;
  }

  /* New horizontal editor controls below map */
  .map-editor-controls {
    margin-top: 12px;
    background: rgba(15, 20, 25, 0.8);
    border: 1px solid var(--vac-border);
    border-radius: 12px;
    padding: 12px;
    animation: fade-in 0.2s ease-out;
  }

  .map-editor-rooms-row {
    margin-bottom: 12px;
  }

  .map-editor-label {
    color: var(--vac-text-secondary);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    display: block;
  }

  .map-editor-room-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .map-editor-room-chip {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 16px;
    padding: 6px 12px;
    color: var(--vac-text-secondary);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .map-editor-room-chip:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--vac-border-hover);
  }

  .map-editor-room-chip.active {
    background: rgba(59, 130, 246, 0.3);
    border-color: var(--vac-accent-blue);
    color: var(--vac-text-primary);
  }

  .map-editor-room-chip.has-polygon {
    color: var(--vac-accent-green);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .map-editor-room-chip.has-polygon::after {
    content: " ✓";
  }

  .map-editor-actions-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--vac-border);
  }

  /* Legacy sidebar styles - kept for compatibility */
  .map-editor-sidebar {
    display: none;
  }

  .map-editor-title {
    color: var(--vac-text-primary);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .map-editor-room-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }

  .map-editor-room-btn {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 8px;
    padding: 8px 10px;
    color: var(--vac-text-secondary);
    font-size: 11px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
  }

  .map-editor-room-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--vac-border-hover);
  }

  .map-editor-room-btn.active {
    background: rgba(59, 130, 246, 0.2);
    border-color: var(--vac-accent-blue);
    color: var(--vac-text-primary);
  }

  .map-editor-room-btn.has-polygon {
    color: var(--vac-accent-green);
  }

  .map-editor-room-btn.has-polygon::after {
    content: "✓";
    font-size: 10px;
  }

  .map-editor-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid var(--vac-border);
  }

  .map-editor-btn {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 8px;
    padding: 8px 12px;
    color: var(--vac-text-secondary);
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s ease;
  }

  .map-editor-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--vac-border-hover);
    color: var(--vac-text-primary);
  }

  .map-editor-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .map-editor-btn.primary {
    background: rgba(34, 197, 94, 0.2);
    border-color: var(--vac-accent-green);
    color: var(--vac-accent-green);
  }

  .map-editor-btn.primary:hover {
    background: rgba(34, 197, 94, 0.3);
  }

  .map-editor-btn.danger {
    background: rgba(239, 68, 68, 0.2);
    border-color: var(--vac-accent-red);
    color: var(--vac-accent-red);
  }

  .map-editor-btn.danger:hover {
    background: rgba(239, 68, 68, 0.3);
  }

  .map-editor-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
  }

  .map-editor-toggle-label {
    color: var(--vac-text-secondary);
    font-size: 11px;
  }

  .map-edit-tooltip {
    position: absolute;
    background: rgba(15, 20, 25, 0.95);
    border: 1px solid var(--vac-border);
    border-radius: 6px;
    padding: 4px 8px;
    color: var(--vac-text-primary);
    font-size: 11px;
    pointer-events: none;
    z-index: 100;
    white-space: nowrap;
    animation: fade-in 0.15s ease-out;
  }

  .map-edit-instructions {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(15, 20, 25, 0.9);
    border: 1px solid var(--vac-border);
    border-radius: 8px;
    padding: 8px 12px;
    color: var(--vac-text-muted);
    font-size: 10px;
    max-width: 200px;
    z-index: 10;
  }

  .map-edit-instructions strong {
    color: var(--vac-text-secondary);
  }

  .map-toggle-edit-btn {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(15, 20, 25, 0.9);
    border: 1px solid var(--vac-border);
    border-radius: 8px;
    padding: 6px 10px;
    color: var(--vac-text-secondary);
    font-size: 11px;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .map-toggle-edit-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--vac-border-hover);
    color: var(--vac-text-primary);
  }

  .map-toggle-edit-btn.active {
    background: rgba(59, 130, 246, 0.2);
    border-color: var(--vac-accent-blue);
    color: var(--vac-accent-blue);
  }

  /* ==========================================
     ROOM CONFIGURATOR MODAL
     ========================================== */

  .configurator-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .configurator-modal {
    background: #1a1f2e;
    border-radius: 16px;
    width: 95vw;
    height: 90vh;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .configurator-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .configurator-modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: var(--vac-text-primary);
  }

  .configurator-close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    color: var(--vac-text-secondary);
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .configurator-close-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    color: #EF4444;
  }

  .configurator-iframe {
    flex: 1;
    width: 100%;
    border: none;
    background: #0a0e14;
  }

  /* ==========================================
     CLEANING CONFIRMATION MODAL
     ========================================== */

  .cleaning-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fade-in 0.2s ease-out;
  }

  .cleaning-modal {
    background: linear-gradient(145deg, #1a1f2e 0%, #0f1419 100%);
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    overflow: visible;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
    animation: modal-slide-up 0.3s ease-out;
  }

  @keyframes modal-slide-up {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .cleaning-modal-header {
    padding: 20px 24px;
    background: rgba(34, 197, 94, 0.1);
    border-bottom: 1px solid rgba(34, 197, 94, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cleaning-modal-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cleaning-modal-icon {
    font-size: 32px;
  }

  .cleaning-modal-title h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--vac-text-primary);
  }

  .cleaning-modal-subtitle {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: var(--vac-text-secondary);
  }

  .cleaning-modal-close {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--vac-text-secondary);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cleaning-modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: var(--vac-text-primary);
  }

  .cleaning-modal-body {
    padding: 20px 24px;
    overflow: visible;
  }

  .cleaning-modal-section {
    margin-bottom: 20px;
    position: relative;
    z-index: 10;
  }

  .cleaning-modal-section:last-child {
    margin-bottom: 0;
    padding-bottom: 10px;
  }

  .cleaning-modal-section-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--vac-text-muted);
    margin-bottom: 10px;
  }

  .cleaning-modal-rooms {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cleaning-modal-room-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: color-mix(in srgb, var(--room-color, #3B82F6) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--room-color, #3B82F6) 40%, transparent);
    border-radius: 10px;
    font-size: 13px;
    color: var(--room-color, #3B82F6);
    font-weight: 500;
  }

  .cleaning-modal-room-icon {
    font-size: 16px;
  }

  .cleaning-modal-room-name {
    color: var(--vac-text-primary);
  }

  .cleaning-modal-full-house {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    color: var(--vac-text-primary);
    font-size: 14px;
  }

  .cleaning-modal-full-house-icon {
    font-size: 24px;
  }

  .setting-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
  }

  .btn-icon {
    font-size: 14px;
  }

  .cleaning-modal-setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cleaning-modal-setting:last-child {
    border-bottom: none;
  }

  .cleaning-modal-setting-label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--vac-text-secondary);
    font-size: 14px;
  }

  .cleaning-modal-setting-icon {
    font-size: 18px;
  }

  .cleaning-modal-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: linear-gradient(145deg, rgba(30, 35, 50, 0.95) 0%, rgba(20, 25, 35, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 10px 36px 10px 14px;
    color: var(--vac-text-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    min-width: 160px;
    transition: all 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239CA3AF' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .cleaning-modal-select:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .cleaning-modal-select:focus {
    outline: none;
    border-color: var(--vac-accent-green);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  /* Custom dropdown component */
  .custom-dropdown {
    position: relative;
    min-width: 180px;
  }

  .custom-dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: linear-gradient(145deg, rgba(30, 35, 50, 0.95) 0%, rgba(20, 25, 35, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 10px 14px;
    color: var(--vac-text-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    width: 100%;
  }

  .custom-dropdown-trigger:hover {
    background: linear-gradient(145deg, rgba(40, 45, 60, 0.95) 0%, rgba(30, 35, 45, 0.95) 100%);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .custom-dropdown-trigger.open {
    border-color: var(--vac-accent-green);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .custom-dropdown-value {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .custom-dropdown-arrow {
    font-size: 10px;
    color: var(--vac-text-muted);
    transition: transform 0.2s;
  }

  .custom-dropdown-trigger.open .custom-dropdown-arrow {
    transform: rotate(180deg);
  }

  .custom-dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: linear-gradient(145deg, #1e2333 0%, #151922 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    overflow: hidden;
    z-index: 1001;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: all 0.2s ease;
  }

  .custom-dropdown-menu.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .custom-dropdown-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    color: var(--vac-text-primary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .custom-dropdown-option:last-child {
    border-bottom: none;
  }

  .custom-dropdown-option:hover {
    background: rgba(34, 197, 94, 0.15);
  }

  .custom-dropdown-option.selected {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.2) 100%);
    color: var(--vac-accent-green);
  }

  .custom-dropdown-option.selected::after {
    content: '✓';
    margin-left: auto;
    color: var(--vac-accent-green);
    font-weight: bold;
  }

  .cleaning-modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 24px;
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0 0 20px 20px;
    position: relative;
    z-index: 1;
  }

  .cleaning-modal-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .cleaning-modal-btn.cancel {
    background: rgba(255, 255, 255, 0.08);
    color: var(--vac-text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cleaning-modal-btn.cancel:hover {
    background: rgba(255, 255, 255, 0.12);
    color: var(--vac-text-primary);
  }

  .cleaning-modal-btn.start {
    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  }

  .cleaning-modal-btn.start:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  .cleaning-modal-btn.start:active {
    transform: translateY(0);
  }

  /* ==========================================
     STATS ROW
     ========================================== */

  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }

  .stat-card {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    border-color: var(--vac-border-hover);
    transform: translateY(-2px);
  }

  .stat-card-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .stat-card-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--vac-text-primary);
    margin-bottom: 4px;
  }

  .stat-card-label {
    font-size: 11px;
    color: var(--vac-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .stat-card-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: var(--vac-accent-green);
    transition: width 0.5s ease;
    animation: bar-fill 1s ease-out;
  }

  .stat-card-bar.warning {
    background: var(--vac-accent-yellow);
  }

  .stat-card-bar.critical {
    background: var(--vac-accent-red);
  }

  /* ==========================================
     STATUS PANEL
     ========================================== */

  .status-panel {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 12px;
  }

  .status-panel.error {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
  }

  .status-panel.warning {
    background: rgba(245, 158, 11, 0.08);
    border-color: rgba(245, 158, 11, 0.2);
  }

  .status-panel-icon {
    font-size: 24px;
  }

  .status-panel-content {
    flex: 1;
  }

  .status-panel-text {
    font-size: 13px;
    color: var(--vac-text-primary);
  }

  .status-panel.error .status-panel-text {
    color: var(--vac-accent-red);
  }

  .status-panel-subtext {
    font-size: 11px;
    color: var(--vac-text-muted);
    margin-top: 2px;
  }

  /* ==========================================
     COMBINED STATUS BAR
     ========================================== */

  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--vac-bg-primary);
    border: 1px solid var(--vac-border);
    border-radius: 12px;
    gap: 16px;
  }

  .status-bar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(34, 197, 94, 0.1);
    border-radius: 8px;
  }

  .status-bar-left.error {
    background: rgba(239, 68, 68, 0.1);
  }

  .status-bar-icon {
    font-size: 16px;
  }

  .status-bar-text {
    font-size: 12px;
    font-weight: 600;
    color: var(--vac-accent-green);
  }

  .status-bar-left.error .status-bar-text {
    color: var(--vac-accent-red);
  }

  .status-bar-stats {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .status-bar-stat {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-bar-stat-icon {
    font-size: 14px;
  }

  .status-bar-stat-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--vac-text-primary);
  }

  /* ==========================================
     TABS
     ========================================== */

  .tabs-container {
    margin-bottom: 16px;
  }

  .tabs-header {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--vac-bg-card);
    border-radius: 12px;
    border: 1px solid var(--vac-border);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }

  .tabs-header::-webkit-scrollbar {
    display: none;
  }

  .tab-button {
    flex: 1;
    padding: 10px 12px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--vac-text-muted);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    white-space: nowrap;
  }

  .tab-button:hover {
    color: var(--vac-text-secondary);
    background: rgba(255,255,255,0.03);
    transform: translateY(-1px);
  }

  .tab-button:active {
    transform: scale(0.97);
  }

  .tab-button.active {
    background: rgba(59, 130, 246, 0.15);
    color: var(--vac-accent-blue);
    transform: translateY(0);
  }

  .tab-icon {
    font-size: 14px;
    transition: transform 0.2s ease;
  }

  .tab-button:hover .tab-icon {
    transform: scale(1.1);
  }

  .tab-content {
    animation: scale-in 0.25s ease-out;
  }

  /* Staggered animation for items in tab content */
  .tab-content > * {
    animation: fade-in 0.3s ease-out backwards;
  }

  .tab-content > *:nth-child(1) { animation-delay: 0ms; }
  .tab-content > *:nth-child(2) { animation-delay: 50ms; }
  .tab-content > *:nth-child(3) { animation-delay: 100ms; }
  .tab-content > *:nth-child(4) { animation-delay: 150ms; }
  .tab-content > *:nth-child(5) { animation-delay: 200ms; }
  .tab-content > *:nth-child(6) { animation-delay: 250ms; }

  .tab-alert {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: var(--vac-accent-yellow);
    color: #000;
    font-size: 10px;
    font-weight: 700;
    border-radius: 50%;
    margin-left: 4px;
  }

  .tabbed-panel {
    min-height: 500px;
  }

  /* Presets in tab */
  .presets-in-tab {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vac-border);
  }

  /* ==========================================
     ROOMS TAB
     ========================================== */

  .room-quick-select {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .room-quick-btn {
    padding: 8px 14px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 8px;
    color: var(--vac-text-secondary);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .room-quick-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--vac-border-hover);
  }

  .room-quick-btn.active {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
    color: var(--vac-accent-blue);
  }

  .rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
    margin-bottom: 16px;
  }

  .room-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 8px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    animation: fade-in 0.25s ease-out backwards;
  }

  /* Stagger room chip animations */
  .rooms-grid .room-chip:nth-child(1) { animation-delay: 0ms; }
  .rooms-grid .room-chip:nth-child(2) { animation-delay: 25ms; }
  .rooms-grid .room-chip:nth-child(3) { animation-delay: 50ms; }
  .rooms-grid .room-chip:nth-child(4) { animation-delay: 75ms; }
  .rooms-grid .room-chip:nth-child(5) { animation-delay: 100ms; }
  .rooms-grid .room-chip:nth-child(6) { animation-delay: 125ms; }
  .rooms-grid .room-chip:nth-child(7) { animation-delay: 150ms; }
  .rooms-grid .room-chip:nth-child(8) { animation-delay: 175ms; }
  .rooms-grid .room-chip:nth-child(9) { animation-delay: 200ms; }
  .rooms-grid .room-chip:nth-child(10) { animation-delay: 225ms; }
  .rooms-grid .room-chip:nth-child(11) { animation-delay: 250ms; }
  .rooms-grid .room-chip:nth-child(12) { animation-delay: 275ms; }
  .rooms-grid .room-chip:nth-child(13) { animation-delay: 300ms; }

  .room-chip:hover {
    background: rgba(255,255,255,0.06);
    transform: translateY(-3px);
    border-color: var(--vac-border-hover);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .room-chip:active {
    transform: scale(0.95);
  }

  .room-chip.selected {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.4);
  }

  .room-chip.preset-highlight {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
  }

  .room-chip-icon {
    font-size: 20px;
  }

  .room-chip-name {
    font-size: 11px;
    font-weight: 500;
    color: var(--vac-text-secondary);
  }

  .room-chip.selected .room-chip-name {
    color: var(--vac-accent-green);
  }

  .room-chip-check {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: var(--vac-accent-green);
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.2s ease;
  }

  .room-chip.selected .room-chip-check {
    opacity: 1;
    transform: scale(1);
  }

  .room-chip {
    position: relative;
  }

  .room-actions {
    display: flex;
    gap: 10px;
  }

  .room-action-btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid var(--vac-border);
    background: var(--vac-bg-card);
    color: var(--vac-text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .room-action-btn:hover {
    background: rgba(255,255,255,0.06);
  }

  .room-action-btn.primary {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
    color: var(--vac-accent-green);
  }

  .room-action-btn.primary:hover {
    background: rgba(34, 197, 94, 0.25);
  }

  .room-action-btn.danger {
    color: var(--vac-accent-red);
  }

  .room-action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  /* ==========================================
     SCHEDULE TAB
     ========================================== */

  .schedule-section {
    margin-bottom: 16px;
  }

  .schedule-section-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--vac-text-primary);
    margin-bottom: 12px;
  }

  /* Weekly Schedule Grid - 2 columns like original */
  .schedule-week-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .schedule-day-card {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    padding: 12px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fade-in 0.3s ease-out backwards;
  }

  /* Stagger day card animations */
  .schedule-week-grid .schedule-day-card:nth-child(1) { animation-delay: 0ms; }
  .schedule-week-grid .schedule-day-card:nth-child(2) { animation-delay: 30ms; }
  .schedule-week-grid .schedule-day-card:nth-child(3) { animation-delay: 60ms; }
  .schedule-week-grid .schedule-day-card:nth-child(4) { animation-delay: 90ms; }
  .schedule-week-grid .schedule-day-card:nth-child(5) { animation-delay: 120ms; }
  .schedule-week-grid .schedule-day-card:nth-child(6) { animation-delay: 150ms; }
  .schedule-week-grid .schedule-day-card:nth-child(7) { animation-delay: 180ms; }

  .schedule-day-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .schedule-day-card.active {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .schedule-day-card.error-disabled {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.25);
    border-style: dashed;
  }

  .schedule-day-card.error-disabled .schedule-day-name {
    color: var(--vac-accent-red);
  }

  .schedule-day-card.today {
    border-color: var(--vac-accent-blue);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
  }

  .schedule-day-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .schedule-day-icon {
    font-size: 16px;
  }

  .schedule-day-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--vac-text-primary);
  }

  .schedule-day-name.today-label {
    color: var(--vac-accent-blue);
  }

  .schedule-day-card.active .schedule-day-name {
    color: var(--vac-accent-green);
  }

  .schedule-day-details {
    padding-left: 24px;
  }

  .schedule-day-time {
    font-size: 11px;
    color: var(--vac-text-secondary);
    margin-bottom: 2px;
  }

  .schedule-day-rooms {
    font-size: 11px;
  }

  .schedule-type-badge {
    display: inline-block;
    font-size: 11px;
    color: var(--vac-text-muted);
  }

  .schedule-type-badge.zone {
    color: var(--vac-accent-purple);
  }

  .schedule-type-badge.daily {
    color: var(--vac-accent-green);
  }

  .schedule-day-none {
    font-size: 11px;
    color: var(--vac-text-dim);
  }

  .schedule-day-error {
    font-size: 10px;
    color: var(--vac-accent-red);
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0.9;
  }

  /* Schedule Toggle Rows */
  .schedule-toggle-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .schedule-toggle-row:hover {
    background: rgba(255,255,255,0.04);
  }

  .schedule-toggle-row.active {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .schedule-toggle-row.compact {
    padding: 10px 14px;
  }

  .schedule-toggle-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .schedule-toggle-content {
    flex: 1;
    min-width: 0;
  }

  .schedule-toggle-label {
    font-size: 13px;
    color: var(--vac-text-primary);
  }

  .schedule-toggle-sublabel {
    font-size: 11px;
    color: var(--vac-text-muted);
  }

  /* Expandable Section */
  .schedule-section.expandable {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    overflow: hidden;
  }

  .schedule-expand-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 12px;
    color: var(--vac-text-secondary);
    background: rgba(255,255,255,0.02);
  }

  .schedule-expand-header:hover {
    background: rgba(255,255,255,0.04);
  }

  .expand-icon {
    font-size: 10px;
    color: var(--vac-text-dim);
  }

  .schedule-expand-content {
    padding: 12px 14px;
    border-top: 1px solid var(--vac-border);
    animation: expand-in 0.3s ease-out;
  }

  /* Stagger children in expand content */
  .schedule-expand-content > * {
    animation: fade-in 0.25s ease-out backwards;
  }
  .schedule-expand-content > *:nth-child(1) { animation-delay: 0ms; }
  .schedule-expand-content > *:nth-child(2) { animation-delay: 40ms; }
  .schedule-expand-content > *:nth-child(3) { animation-delay: 80ms; }
  .schedule-expand-content > *:nth-child(4) { animation-delay: 120ms; }
  .schedule-expand-content > *:nth-child(5) { animation-delay: 160ms; }
  .schedule-expand-content > *:nth-child(6) { animation-delay: 200ms; }

  /* Day Chips */
  .schedule-day-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin: 12px 0;
  }

  .day-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 16px;
    cursor: pointer;
    font-size: 12px;
    color: var(--vac-text-secondary);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .day-chip:hover {
    background: rgba(255,255,255,0.06);
    transform: translateY(-1px);
  }

  .day-chip:active {
    transform: scale(0.95);
    animation: chip-pop 0.2s ease-out;
  }

  .day-chip.active {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.4);
    color: var(--vac-accent-green);
  }

  .day-chip-icon {
    font-size: 10px;
  }

  .day-chip-name {
    font-size: 11px;
    font-weight: 500;
  }

  /* Scheduled Rooms Section */
  .schedule-rooms-section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--vac-border);
  }

  .schedule-rooms-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--vac-text-secondary);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  /* Quick Select Chips */
  .schedule-quick-chips {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .quick-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 16px;
    cursor: pointer;
    font-size: 11px;
    color: var(--vac-accent-blue);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .quick-chip:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }

  .quick-chip:active {
    transform: scale(0.95);
    border-color: rgba(59, 130, 246, 0.4);
  }

  /* Old schedule-week kept for backwards compatibility but hidden */
  .schedule-week {
    display: none;
  }

  .schedule-day {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    padding: 12px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    background: var(--vac-text-dim);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .toggle-switch:hover {
    filter: brightness(1.1);
  }

  .toggle-switch:active {
    transform: scale(0.95);
  }

  .toggle-switch.on {
    background: var(--vac-accent-green);
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .toggle-switch.on::after {
    transform: translateX(20px);
  }

  .toggle-switch.animating::after {
    animation: toggle-bounce 0.3s ease-out;
  }

  .next-clean-info {
    padding: 12px 16px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .next-clean-icon {
    font-size: 20px;
  }

  .next-clean-text {
    font-size: 13px;
    color: var(--vac-text-primary);
  }

  .next-clean-time {
    color: var(--vac-accent-blue);
    font-weight: 600;
  }

  .next-clean-label {
    color: var(--vac-text-secondary);
    margin-right: 4px;
  }

  .next-clean-mode {
    color: var(--vac-text-muted);
    font-size: 11px;
    margin-left: 8px;
  }

  .next-clean-info.skipped {
    background: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.3);
  }

  .next-clean-info.skipped .next-clean-label {
    color: var(--vac-accent-yellow);
  }

  .schedule-day-mode {
    font-size: 12px;
    margin-top: 2px;
  }

  .schedule-day-icon.off {
    color: var(--vac-text-dim);
    font-size: 16px;
  }

  /* Schedule Settings */
  .schedule-setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .schedule-setting-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--vac-text-primary);
  }

  .schedule-setting-icon {
    font-size: 14px;
  }

  .schedule-time-input {
    padding: 6px 10px;
    background: #1a1f2e;
    border: 1px solid var(--vac-border);
    border-radius: 6px;
    color: var(--vac-text-primary);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
  }

  .schedule-time-input::-webkit-calendar-picker-indicator {
    filter: invert(0.8);
    cursor: pointer;
  }

  .schedule-time-input:focus {
    outline: none;
    border-color: var(--vac-accent-blue);
  }

  /* Scheduled Rooms Grid */
  .schedule-rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }

  .schedule-room-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 8px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
  }

  .schedule-room-chip:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--vac-border-hover);
    transform: translateY(-2px);
  }

  .schedule-room-chip:active {
    transform: scale(0.95);
  }

  .schedule-room-chip.active {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.4);
  }

  .schedule-room-icon {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .schedule-room-name {
    font-size: 11px;
    color: var(--vac-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .schedule-room-chip.active .schedule-room-name {
    color: var(--vac-accent-green);
  }

  /* ==========================================
     SETTINGS TAB
     ========================================== */

  .settings-group {
    margin-bottom: 20px;
  }

  .settings-group-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--vac-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .setting-label {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .setting-icon {
    font-size: 18px;
  }

  .setting-name {
    font-size: 13px;
    color: var(--vac-text-primary);
  }

  .setting-value {
    font-size: 13px;
    color: var(--vac-accent-blue);
    font-weight: 500;
  }

  .setting-select {
    padding: 8px 12px;
    background: #1a1f2e;
    border: 1px solid var(--vac-border);
    border-radius: 8px;
    color: var(--vac-text-primary);
    font-size: 12px;
    cursor: pointer;
    min-width: 130px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 14px;
    padding-right: 32px;
  }

  .setting-select:hover {
    border-color: var(--vac-border-hover);
  }

  .setting-select:focus {
    outline: none;
    border-color: var(--vac-accent-blue);
  }

  .setting-select option {
    background: #1a1f2e;
    color: var(--vac-text-primary);
    padding: 12px;
  }

  .setting-slider {
    width: 120px;
    height: 6px;
    -webkit-appearance: none;
    background: var(--vac-text-dim);
    border-radius: 3px;
    cursor: pointer;
  }

  .setting-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--vac-accent-blue);
    border-radius: 50%;
    cursor: pointer;
  }

  .feature-toggles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }

  .feature-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .feature-toggle:hover {
    background: rgba(255,255,255,0.06);
  }

  .feature-toggle.on {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .feature-toggle-icon {
    font-size: 18px;
  }

  .feature-toggle-name {
    font-size: 11px;
    color: var(--vac-text-secondary);
    font-weight: 500;
  }

  .feature-toggle.on .feature-toggle-name {
    color: var(--vac-accent-green);
  }

  /* ==========================================
     MAINTENANCE TAB
     ========================================== */

  .maintenance-section {
    margin-bottom: 20px;
  }

  .maintenance-section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--vac-text-secondary);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .consumable-card {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .consumable-card:hover {
    background: rgba(255,255,255,0.06);
  }

  .consumable-card.warning {
    border-color: rgba(245, 158, 11, 0.4);
  }

  .consumable-card.critical {
    border-color: rgba(239, 68, 68, 0.4);
  }

  .consumable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .consumable-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: var(--vac-text-primary);
  }

  .consumable-icon {
    font-size: 18px;
  }

  .consumable-percent {
    font-size: 16px;
    font-weight: 700;
  }

  .consumable-percent.good { color: var(--vac-accent-green); }
  .consumable-percent.warning { color: var(--vac-accent-yellow); }
  .consumable-percent.critical { color: var(--vac-accent-red); }

  .consumable-bar {
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .consumable-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .consumable-bar-fill.good { background: var(--vac-accent-green); }
  .consumable-bar-fill.warning { background: var(--vac-accent-yellow); }
  .consumable-bar-fill.critical { background: var(--vac-accent-red); }

  .consumable-footer {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--vac-text-muted);
  }

  .consumable-alert {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--vac-accent-yellow);
  }

  .consumable-alert.critical {
    color: var(--vac-accent-red);
  }

  .lifetime-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .lifetime-stat {
    background: var(--vac-bg-card);
    border: 1px solid var(--vac-border);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
  }

  .lifetime-stat-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--vac-text-primary);
    margin-bottom: 4px;
  }

  .lifetime-stat-label {
    font-size: 10px;
    color: var(--vac-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .tap-to-reset {
    font-size: 10px;
    color: var(--vac-text-dim);
    text-align: center;
    margin-top: 4px;
  }

  /* ==========================================
     RESPONSIVE
     ========================================== */

  @media (max-width: 900px) {
    .dashboard {
      padding: 16px;
    }

    .header {
      padding: 16px;
    }

    .header-title {
      font-size: 22px;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .header-right {
      width: 100%;
      align-items: flex-start;
    }

    .header-badges {
      width: 100%;
    }

    .cleaning-stats {
      gap: 24px;
    }

    .cleaning-stat-value {
      font-size: 22px;
    }
  }

  @media (max-width: 600px) {
    .dashboard {
      padding: 12px;
    }

    .header {
      padding: 12px;
    }

    .header-title {
      font-size: 18px;
    }

    .header-title-icon {
      font-size: 24px;
    }

    .header-subtitle {
      font-size: 12px;
    }

    .quick-actions {
      grid-template-columns: repeat(3, 1fr);
    }

    .action-button {
      padding: 12px 8px;
    }

    .action-icon {
      font-size: 24px;
    }

    .action-label {
      font-size: 10px;
    }

    .tab-button {
      padding: 8px 10px;
      font-size: 10px;
    }
  }
`;

// ============================================
// PHASE 1: VACUUM DASHBOARD CARD - CORE
// ============================================

class VacuumDashboard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _activeTab: { type: String },
      _selectedRooms: { type: Array },
      _activePreset: { type: String },
      _mapEditMode: { type: Boolean },
      _showRoomConfigurator: { type: Boolean },  // Show room map configurator modal
      _configuratorIframeSrc: { type: String },  // Cached iframe URL to prevent re-renders
      _scheduleExpanded: { type: Boolean },
      _showCleaningModal: { type: Boolean },  // Show cleaning confirmation modal
      // Map editor properties
      _editingRoom: { type: String },
      _currentPolygon: { type: Array },
      _roomPolygons: { type: Object },
      _undoStack: { type: Array },
      _redoStack: { type: Array },
      _hoveredRoom: { type: String },
      _dragPointIndex: { type: Number },
      _showGrid: { type: Boolean },
    };
  }

  static get styles() {
    return cardStyles;
  }

  constructor() {
    super();
    this._activeTab = 'rooms';
    this._selectedRooms = [];
    this._activePreset = null;
    this._mapEditMode = false;
    this._showRoomConfigurator = false;
    this._configuratorIframeSrc = null;
    this._scheduleExpanded = false;
    this._showCleaningModal = false;
    this._openDropdown = null; // Track which dropdown is open ('fanSpeed', 'workMode', 'waterFlow')
    this._modalFanSpeed = null;
    this._modalWorkMode = null;
    this._modalWaterFlow = null;
    // Map editor state
    this._editingRoom = null;
    this._currentPolygon = [];
    this._roomPolygons = {};
    this._undoStack = [];
    this._redoStack = [];
    this._hoveredRoom = null;
    this._dragPointIndex = -1;
    this._showGrid = true;
    this._justClosedPolygon = false;
    // Map refresh
    this._mapRefreshInterval = null;
    this._mapImageTimestamp = Date.now();
  }

  connectedCallback() {
    super.connectedCallback();
    // Start map image refresh interval (every 500ms for real-time vacuum tracking)
    this._startMapRefresh();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up the refresh interval
    this._stopMapRefresh();
  }

  _startMapRefresh() {
    // Clear any existing interval
    this._stopMapRefresh();
    // Refresh map image every 500ms (0.5 seconds) for real-time tracking
    this._mapRefreshInterval = setInterval(() => {
      this._mapImageTimestamp = Date.now();
      // Only request update if we're on the rooms tab (where map is visible)
      if (this._activeTab === 'rooms') {
        this.requestUpdate();
      }
    }, 500);
  }

  _stopMapRefresh() {
    if (this._mapRefreshInterval) {
      clearInterval(this._mapRefreshInterval);
      this._mapRefreshInterval = null;
    }
  }

  setConfig(config) {
    if (!config.vacuum_entity) {
      throw new Error("You must define a vacuum_entity");
    }
    this.config = {
      title: "Alfonso Robot Vacuum",
      subtitle: "Ecovacs Deebot X2 Omni",
      icon: "🤖",
      ...config
    };
  }

  getCardSize() {
    return 10;
  }

  // ============================================
  // STATE HELPERS
  // ============================================

  _getState(entityId) {
    if (!this.hass || !entityId) return null;
    return this.hass.states[entityId];
  }

  _getStateValue(entityId, defaultValue = "—") {
    const state = this._getState(entityId);
    if (!state || state.state === "unavailable" || state.state === "unknown") {
      return defaultValue;
    }
    return state.state;
  }

  _getStateAttr(entityId, attr, defaultValue = null) {
    const state = this._getState(entityId);
    if (!state || !state.attributes) return defaultValue;
    return state.attributes[attr] ?? defaultValue;
  }

  _getVacuumStatus() {
    const state = this._getStateValue(this.config.vacuum_entity, "unknown");
    return state.toLowerCase();
  }

  _getStatusClass() {
    const status = this._getVacuumStatus();
    if (status === "cleaning") return "cleaning";
    if (status === "docked" || status === "charging") return "docked";
    if (status === "returning") return "returning";
    if (status === "paused") return "paused";
    if (status === "error") return "error";
    if (status === "idle") return "idle";
    return "docked";
  }

  _getStatusLabel() {
    const status = this._getVacuumStatus();
    const labels = {
      cleaning: "Cleaning",
      docked: "Docked",
      charging: "Charging",
      idle: "Idle",
      returning: "Returning",
      paused: "Paused",
      error: "Error"
    };
    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  }

  _isCharging() {
    const status = this._getVacuumStatus();
    // Check both status and battery charging attribute if available
    if (status === "charging") return true;
    const batteryState = this._getState(this.config.battery_entity);
    if (batteryState?.attributes?.charging) return true;
    // Check if docked and battery < 100
    if (status === "docked") {
      const battery = parseInt(this._getStateValue(this.config.battery_entity, "100"));
      return battery < 100;
    }
    return false;
  }

  _getBatteryClass(battery) {
    const b = parseInt(battery) || 0;
    if (b <= 20) return "low";
    if (b <= 40) return "medium";
    return "high";
  }

  _getBatteryIcon(battery, isCharging) {
    const b = parseInt(battery) || 0;
    if (isCharging) return "🔋";
    if (b <= 10) return "🪫";
    if (b <= 30) return "🔋";
    return "🔋";
  }

  _getChargingETA(battery) {
    // Estimate ~1% per minute for most vacuums
    const b = parseInt(battery) || 0;
    const remaining = 100 - b;
    if (remaining <= 0) return "Fully charged";
    if (remaining <= 10) return "Almost full";
    const mins = remaining; // 1% per minute estimate
    if (mins < 60) return `~${mins} min to full`;
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `~${hours}h ${m}m to full`;
  }

  // ============================================
  // ACTION HANDLERS
  // ============================================

  _handleAction(action) {
    const vacuumEntity = this.config.vacuum_entity;

    switch (action) {
      case "start":
        if (this._selectedRooms.length > 0) {
          // Use script to start with selected rooms
          this.hass.callService("script", "vacuum_smart_start");
        } else {
          this.hass.callService("vacuum", "start", { entity_id: vacuumEntity });
        }
        break;
      case "pause":
        this.hass.callService("vacuum", "pause", { entity_id: vacuumEntity });
        break;
      case "resume":
        this.hass.callService("vacuum", "start", { entity_id: vacuumEntity });
        break;
      case "stop":
        this.hass.callService("script", "stop_vacuum_and_reset_rooms");
        this._selectedRooms = [];
        this._activePreset = null;
        break;
      case "return":
        this.hass.callService("vacuum", "return_to_base", { entity_id: vacuumEntity });
        break;
      case "locate":
        this.hass.callService("vacuum", "locate", { entity_id: vacuumEntity });
        break;
    }
  }

  _handlePreset(preset) {
    const presets = this._getPresets();
    const presetConfig = presets.find(p => p.id === preset);

    if (!presetConfig) return;

    // Set active preset and select the rooms
    this._activePreset = preset;
    this._selectedRooms = [...presetConfig.rooms];

    // Update HA input_booleans for the selected rooms
    const rooms = this._getRooms();

    // First turn off all room booleans
    rooms.forEach(room => {
      if (room.input_boolean) {
        const shouldBeOn = presetConfig.rooms.includes(room.id);
        this.hass.callService("input_boolean", shouldBeOn ? "turn_on" : "turn_off", {
          entity_id: room.input_boolean
        });
      }
    });

    this.requestUpdate();

    // Open the cleaning confirmation modal
    this._openCleaningModal();
  }

  _toggleRoom(roomId) {
    const room = this._getRooms().find(r => r.id === roomId);
    if (!room) return;

    // Toggle the input_boolean in HA
    if (room.input_boolean) {
      const currentState = this._getStateValue(room.input_boolean, "off");
      this.hass.callService("input_boolean", currentState === "on" ? "turn_off" : "turn_on", {
        entity_id: room.input_boolean
      });
    }

    // Update local state
    if (this._selectedRooms.includes(roomId)) {
      this._selectedRooms = this._selectedRooms.filter(r => r !== roomId);
    } else {
      this._selectedRooms = [...this._selectedRooms, roomId];
    }

    // Clear active preset since we're manually selecting
    this._activePreset = null;
    this.requestUpdate();
  }

  _clearAllRooms() {
    // Turn off all room input_booleans
    this._getRooms().forEach(room => {
      if (room.input_boolean) {
        this.hass.callService("input_boolean", "turn_off", {
          entity_id: room.input_boolean
        });
      }
    });
    this._selectedRooms = [];
    this._activePreset = null;
    this.requestUpdate();
  }

  _selectAllRooms() {
    const rooms = this._getRooms();
    rooms.forEach(room => {
      if (room.input_boolean) {
        this.hass.callService("input_boolean", "turn_on", {
          entity_id: room.input_boolean
        });
      }
    });
    this._selectedRooms = rooms.map(r => r.id);
    this._activePreset = null;
    this.requestUpdate();
  }

  // ============================================
  // ROOM CONFIGURATOR MODAL
  // ============================================

  _openRoomConfigurator() {
    // Build the iframe URL once when opening (not on every render)
    const mapState = this._getState(this.config.map_entity);
    const mapUrl = mapState?.attributes?.entity_picture || '';
    const fullMapUrl = mapUrl ? (mapUrl.startsWith('http') ? mapUrl : window.location.origin + mapUrl) : '';
    this._configuratorIframeSrc = `/local/community/vacuum-dashboard/vacuum-room-configurator.html?v=${Date.now()}&mapUrl=${encodeURIComponent(fullMapUrl)}`;
    this._showRoomConfigurator = true;
    this.requestUpdate();
  }

  _closeRoomConfigurator() {
    this._showRoomConfigurator = false;
    this._configuratorIframeSrc = null;  // Clear so next open gets fresh URL
    this.requestUpdate();
  }

  // ============================================
  // DATA GETTERS
  // ============================================

  _getRooms() {
    return this.config.rooms || [
      { id: "living_room", name: "Living Room", icon: "🛋️", input_boolean: "input_boolean.clean_room_living_room" },
      { id: "kitchen", name: "Kitchen", icon: "🍳", input_boolean: "input_boolean.clean_room_kitchen" },
      { id: "master_bedroom", name: "Master Bed", icon: "🛏️", input_boolean: "input_boolean.clean_room_master_bedroom" },
      { id: "guest_bedroom", name: "Guest Bed", icon: "🛏️", input_boolean: "input_boolean.clean_room_guest_bedroom" },
      { id: "bathroom", name: "Bathroom", icon: "🚿", input_boolean: "input_boolean.clean_room_bathroom" },
      { id: "ensuite", name: "Ensuite", icon: "🚿", input_boolean: "input_boolean.clean_room_ensuite" },
      { id: "media_room", name: "Media Room", icon: "📺", input_boolean: "input_boolean.clean_room_media_room" },
      { id: "office", name: "Office", icon: "💻", input_boolean: "input_boolean.clean_room_office" },
      { id: "beauty_room", name: "Beauty Room", icon: "💄", input_boolean: "input_boolean.clean_room_beauty_room" },
      { id: "entryway", name: "Entry", icon: "🚪", input_boolean: "input_boolean.clean_room_entryway" },
      { id: "hallway", name: "Hallway", icon: "🚶", input_boolean: "input_boolean.clean_room_hallway" },
      { id: "laundry", name: "Laundry", icon: "🧺", input_boolean: "input_boolean.clean_room_laundry" },
      { id: "master_robe", name: "Master Robe", icon: "👔", input_boolean: "input_boolean.clean_room_master_robe" },
    ];
  }

  _getPresets() {
    return this.config.presets || [
      {
        id: "bedrooms",
        name: "Bedrooms",
        icon: "🛏️",
        class: "bedrooms",
        rooms: ["master_bedroom", "guest_bedroom", "master_robe"],
        script: "script.clean_bedrooms_only"
      },
      {
        id: "living",
        name: "Living Areas",
        icon: "🛋️",
        class: "living",
        rooms: ["living_room", "media_room", "hallway", "entryway"],
        script: "script.clean_living_areas"
      },
      {
        id: "bathrooms",
        name: "Bathrooms",
        icon: "🚿",
        class: "bathrooms",
        rooms: ["bathroom", "ensuite", "laundry"],
        script: "script.clean_bathrooms_only"
      },
    ];
  }

  _getMaintenanceClass(value) {
    const v = parseFloat(value) || 0;
    if (v >= 50) return "good";
    if (v >= 20) return "warning";
    return "critical";
  }

  _getMaintenanceItemClass(value) {
    const v = parseFloat(value) || 0;
    if (v >= 50) return "";
    if (v >= 20) return "warning";
    return "critical";
  }

  _getMaintenanceAlert(value) {
    const v = parseFloat(value) || 0;
    if (v < 15) return { text: "Replace now", class: "critical", icon: "🔴" };
    if (v < 30) return { text: "Order soon", class: "warning", icon: "⚠️" };
    return null;
  }

  _formatLastRun() {
    const vacuumState = this._getState(this.config.vacuum_entity);
    if (!vacuumState) return null;

    const lastChanged = new Date(vacuumState.last_changed);
    const now = new Date();
    const diffMs = now - lastChanged;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeText;
    if (diffMins < 1) timeText = "Just now";
    else if (diffMins < 60) timeText = `${diffMins} min ago`;
    else if (diffHours < 24) timeText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    else timeText = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return { time: timeText, date: lastChanged };
  }

  _formatError(errorDescription) {
    if (!errorDescription) return "Unknown error";

    const parts = errorDescription.split(': ');
    let errorText = parts.length > 1 ? parts[1] : errorDescription;

    return errorText
      .replace('FreshWaterBox', 'Fresh Water Box')
      .replace('DustBin', 'Dust Bin')
      .replace('MainBrush', 'Main Brush')
      .replace('SideBrush', 'Side Brush')
      .replace('CleaningPad', 'Cleaning Pad')
      .replace('WaterTank', 'Water Tank');
  }

  // ============================================
  // RENDER
  // ============================================

  render() {
    if (!this.hass || !this.config) {
      return html`<div class="dashboard"><div class="panel">Loading...</div></div>`;
    }

    const status = this._getVacuumStatus();
    const statusClass = this._getStatusClass();
    const isCleaning = status === "cleaning";
    const isPaused = status === "paused";
    const isCharging = this._isCharging();

    // Get sensor values
    const battery = this._getStateValue(this.config.battery_entity, "100");
    const areaCleaned = this._getStateValue(this.config.area_cleaned_entity, "0");
    const cleaningDuration = this._getStateValue(this.config.cleaning_duration_entity, "0");
    const hasMop = this._getStateValue(this.config.mop_attached_entity, "off") === "on";

    // Maintenance sensors
    const filterLife = this._getStateValue(this.config.filter_lifespan_entity, "100");
    const mainBrushLife = this._getStateValue(this.config.main_brush_lifespan_entity, "100");
    const sideBrushLife = this._getStateValue(this.config.side_brush_lifespan_entity, "100");

    // Error status
    const errorState = this._getState(this.config.error_entity);
    const errorDescription = errorState?.attributes?.description || "NoError: Robot is operational";
    const hasError = errorDescription !== "NoError: Robot is operational" && status === "error";

    // Last run info
    const lastRun = this._formatLastRun();

    // Presets
    const presets = this._getPresets();

    return html`
      <div class="dashboard">
        <div class="dashboard-container">
          <!-- Header with integrated Quick Actions -->
          ${this._renderHeader(status, statusClass, isCleaning, isPaused, isCharging, battery, hasMop, areaCleaned, cleaningDuration, lastRun)}

          <div class="main-layout">
            <div class="sidebar">
              <!-- Tabbed Interface (Rooms, Schedule, Settings, Maintenance) -->
              ${this._renderTabbedInterface(filterLife, mainBrushLife, sideBrushLife)}
            </div>

            <div class="main-content">
              <!-- Combined Status & Stats Bar -->
              ${this._renderStatusBar(hasError, errorDescription, battery, areaCleaned, cleaningDuration)}

              <!-- Vacuum Map -->
              ${this._renderMap()}
            </div>
          </div>
        </div>

        <!-- Room Map Configurator Modal -->
        ${this._showRoomConfigurator && this._configuratorIframeSrc ? html`
          <div class="configurator-modal-overlay" @click="${(e) => { if (e.target.classList.contains('configurator-modal-overlay')) { this._closeRoomConfigurator(); }}}">
            <div class="configurator-modal">
              <div class="configurator-modal-header">
                <h2>🗺️ Room Zone Configurator</h2>
                <button class="configurator-close-btn" @click="${() => { this._closeRoomConfigurator(); }}">✕</button>
              </div>
              <iframe
                src="${this._configuratorIframeSrc}"
                class="configurator-iframe"
                title="Room Zone Configurator"
              ></iframe>
            </div>
          </div>
        ` : ''}

        <!-- Cleaning Confirmation Modal -->
        ${this._showCleaningModal ? this._renderCleaningModal() : ''}
      </div>
    `;
  }

  _renderHeader(status, statusClass, isCleaning, isPaused, isCharging, battery, hasMop, areaCleaned, cleaningDuration, lastRun) {
    const batteryClass = this._getBatteryClass(battery);
    const batteryIcon = this._getBatteryIcon(battery, isCharging);
    const selectedCount = this._selectedRooms.length;

    // Determine primary button state
    let primaryLabel = selectedCount > 0 ? `Start ${selectedCount} Room${selectedCount > 1 ? 's' : ''}` : "Start Full House";
    let primaryAction = "start";
    let primaryDisabled = isCleaning;
    let primaryClass = "primary";

    if (isPaused) {
      primaryLabel = "Resume";
      primaryAction = "resume";
      primaryDisabled = false;
    } else if (isCleaning) {
      primaryLabel = "Cleaning...";
      primaryDisabled = true;
      primaryClass = "primary cleaning";
    }

    return html`
      <div class="panel header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="header-title">
              <span class="header-title-icon ${isCleaning ? 'cleaning' : ''}">${this.config.icon}</span>
              ${this.config.title}
            </h1>
            <p class="header-subtitle">${this.config.subtitle}</p>
          </div>

          <div class="header-right">
            <div class="header-badges">
              <div class="status-badge ${statusClass}">
                <span class="status-dot"></span>
                ${this._getStatusLabel()}
              </div>

              ${hasMop ? html`
                <div class="mop-badge">
                  <span class="mop-badge-icon">💧</span>
                  Mop
                </div>
              ` : ''}

              <div class="battery-display">
                <div class="battery-icon-wrapper ${isCharging ? 'charging' : ''}">
                  <span>${batteryIcon}</span>
                  ${isCharging ? html`<span class="battery-bolt">⚡</span>` : ''}
                </div>
                <div class="battery-info">
                  <span class="battery-percent ${batteryClass}">${battery}%</span>
                  <span class="battery-status ${isCharging ? 'charging' : ''}">
                    ${isCharging ? this._getChargingETA(battery) : 'Battery'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions in Header -->
        <div class="header-actions">
          <div class="header-action-btn ${primaryClass} ${primaryDisabled ? 'disabled' : ''}"
               @click="${() => primaryAction === 'start' ? this._openCleaningModal() : this._handleAction(primaryAction)}">
            <span class="action-emoji">${isCleaning ? '🔄' : '▶️'}</span>
            ${primaryLabel}
          </div>

          <div class="header-action-btn ${!isCleaning && !isPaused ? 'disabled' : ''}"
               @click="${() => this._handleAction(isPaused ? 'resume' : 'pause')}">
            <span class="action-emoji">${isPaused ? '▶️' : '⏸️'}</span>
            ${isPaused ? 'Resume' : 'Pause'}
          </div>

          <div class="header-action-btn"
               @click="${() => this._handleAction('stop')}">
            <span class="action-emoji">⏹️</span>
            Stop
          </div>

          <div class="header-action-btn"
               @click="${() => this._handleAction('return')}">
            <span class="action-emoji">🏠</span>
            Dock
          </div>

          <div class="header-action-btn"
               @click="${() => this._handleAction('locate')}">
            <span class="action-emoji">📍</span>
            Locate
          </div>
        </div>

        ${isCleaning ? html`
          <div class="cleaning-indicator">
            <div class="cleaning-stats">
              <div class="cleaning-stat">
                <div class="cleaning-stat-value">
                  <span class="pulse-dot"></span>
                  ${Math.round(parseFloat(areaCleaned))} m²
                </div>
                <div class="cleaning-stat-label">Area Cleaned</div>
              </div>
              <div class="cleaning-stat">
                <div class="cleaning-stat-value">${Math.round(parseFloat(cleaningDuration))} min</div>
                <div class="cleaning-stat-label">Duration</div>
              </div>
            </div>
          </div>
        ` : ''}

        ${!isCleaning && lastRun ? html`
          <div class="last-run-info">
            <span class="last-run-icon">🕐</span>
            <div class="last-run-text">
              <span class="last-run-time">Last cleaned: ${lastRun.time}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderQuickActions(status, isCleaning, isPaused) {
    const selectedCount = this._selectedRooms.length;

    // Determine primary button state
    let primaryLabel = "Start";
    let primarySublabel = selectedCount > 0 ? `${selectedCount} room${selectedCount > 1 ? 's' : ''}` : "Full House";
    let primaryAction = "start";
    let primaryDisabled = isCleaning;
    let primaryClass = "primary";

    if (isPaused) {
      primaryLabel = "Resume";
      primarySublabel = "";
      primaryAction = "resume";
      primaryDisabled = false;
    } else if (isCleaning) {
      primaryLabel = "Cleaning";
      primarySublabel = "";
      primaryDisabled = true;
      primaryClass = "primary cleaning";
    }

    return html`
      <div class="panel">
        <h3 class="panel-title">
          <span class="panel-title-icon">⚡</span>
          Quick Actions
        </h3>
        <div class="quick-actions">
          <div class="action-button ${primaryClass} ${primaryDisabled ? 'disabled' : ''}"
               @click="${() => primaryAction === 'start' ? this._openCleaningModal() : this._handleAction(primaryAction)}">
            <span class="action-icon ${isPaused ? 'resume' : 'start'}">
              ${isCleaning ? '🔄' : (isPaused ? '▶️' : '▶️')}
            </span>
            <span class="action-label">${primaryLabel}</span>
            ${primarySublabel ? html`<span class="action-sublabel">${primarySublabel}</span>` : ''}
          </div>

          <div class="action-button ${!isCleaning && !isPaused ? 'disabled' : ''}"
               @click="${() => this._handleAction(isPaused ? 'resume' : 'pause')}">
            <span class="action-icon pause">${isPaused ? '▶️' : '⏸️'}</span>
            <span class="action-label">${isPaused ? 'Resume' : 'Pause'}</span>
          </div>

          <div class="action-button"
               @click="${() => this._handleAction('stop')}">
            <span class="action-icon stop">⏹️</span>
            <span class="action-label">Stop</span>
          </div>

          <div class="action-button"
               @click="${() => this._handleAction('return')}">
            <span class="action-icon dock">🏠</span>
            <span class="action-label">Dock</span>
          </div>

          <div class="action-button"
               @click="${() => this._handleAction('locate')}">
            <span class="action-icon locate">📍</span>
            <span class="action-label">Locate</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderPresets(presets) {
    return html`
      <div class="panel">
        <h3 class="panel-title">
          <span class="panel-title-icon">⭐</span>
          Quick Presets
        </h3>
        <div class="presets-container">
          <div class="presets-row">
            ${presets.map(preset => html`
              <div class="preset-chip ${preset.class} ${this._activePreset === preset.id ? 'active' : ''}"
                   @click="${() => this._handlePreset(preset.id)}">
                <span class="preset-chip-icon">${preset.icon}</span>
                ${preset.name}
                <span class="preset-chip-count">(${preset.rooms.length})</span>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  _renderMap() {
    const mapState = this._getState(this.config.map_entity);
    const baseMapUrl = mapState?.attributes?.entity_picture || '';
    // Add cache-busting timestamp for real-time map updates (vacuum position tracking)
    const mapUrl = baseMapUrl ? `${baseMapUrl}${baseMapUrl.includes('?') ? '&' : '?'}t=${this._mapImageTimestamp}` : '';
    const rooms = this._getRooms();

    // Get room polygons from config (created via the configurator)
    const allPolygons = this.config.room_polygons || {};

    return html`
      <div class="panel map-panel">
        <h3 class="panel-title">
          <span class="panel-title-icon">🗺️</span>
          Live Map
          ${this._mapEditMode ? html`<span style="color: var(--vac-accent-blue); margin-left: auto; font-size: 11px;">✏️ EDIT MODE</span>` : ''}
        </h3>
        <div class="map-container ${this._mapEditMode ? 'edit-mode' : ''}"
             @click="${this._handleMapClick}"
             @mousemove="${this._handleMapMouseMove}"
             @mouseup="${this._handleMapMouseUp}"
             @mouseleave="${this._handleMapMouseLeave}">
          ${mapUrl ? html`
            <img class="map-image" src="${mapUrl}" alt="Vacuum Map" />

            <!-- HTML Grid overlay (outside SVG to avoid distortion) -->
            ${this._mapEditMode && this._showGrid ? this._renderHtmlGrid() : ''}

            <!-- SVG Overlay for room zones -->
            <svg class="map-overlay interactive"
                 viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid meet"
                 .innerHTML="${this._buildRoomPolygonsSVG(rooms, allPolygons)}"
                 @click="${this._handleMapPolygonClick}"
                 @mousemove="${this._handleMapPolygonHover}"
                 @mouseleave="${() => { this._hoveredRoom = null; this.requestUpdate(); }}">
            </svg>

            <!-- Edit zones button - opens configurator modal -->
            <button class="map-toggle-edit-btn"
                    @click="${(e) => { e.stopPropagation(); this._openRoomConfigurator(); }}">
              ✏️ Edit Zones
            </button>

          ` : html`
            <div class="map-placeholder">
              <span class="map-placeholder-icon">🗺️</span>
              <span>Map not available</span>
            </div>
          `}
        </div>
      </div>
    `;
  }

  _buildRoomPolygonsSVG(rooms, allPolygons) {
    // Build SVG content as a STRING (lit-html doesn't handle SVG arrays well)
    let svgContent = '';

    // Build pattern and filter definitions
    let defs = '<defs>';

    // Add CSS animations for effects
    defs += `
      <style>
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes text-pulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .room-selected-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .room-label-selected {
          animation: fade-in 0.3s ease-out forwards, text-pulse 2.5s ease-in-out 0.3s infinite;
        }
        .room-label-hover {
          animation: fade-in 0.2s ease-out forwards;
        }
      </style>
    `;

    for (const room of rooms) {
      const isSelected = this._selectedRooms.includes(room.id);
      const roomColor = this._getRoomColor(room.id);
      const rgb = this._hexToRgb(roomColor);

      if (isSelected) {
        // Diagonal stripe pattern
        defs += `
          <pattern id="stripe-${room.id}" patternUnits="userSpaceOnUse" width="2.5" height="2.5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="2.5" stroke="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)" stroke-width="1" />
          </pattern>
        `;

        // Radial gradient for inner glow effect
        defs += `
          <radialGradient id="glow-${room.id}" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)" />
            <stop offset="70%" stop-color="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)" />
            <stop offset="100%" stop-color="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)" />
          </radialGradient>
        `;

        // Outer glow filter
        defs += `
          <filter id="outer-glow-${room.id}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
            <feFlood flood-color="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        `;
      }
    }
    defs += '</defs>';
    svgContent += defs;

    for (const room of rooms) {
      const polygon = allPolygons[room.id];
      if (!polygon || polygon.length < 3) continue;

      const points = polygon.map(p => `${p.x},${p.y}`).join(' ');
      const isSelected = this._selectedRooms.includes(room.id);
      const isHovered = this._hoveredRoom === room.id;

      // Get the room's color (from config or default color map)
      const roomColor = this._getRoomColor(room.id);
      const rgb = this._hexToRgb(roomColor);

      const center = this._getPolygonCenter(polygon);
      const bounds = this._getPolygonBounds(polygon);

      if (isSelected) {
        // === SELECTED STATE: Multi-layer premium effect ===

        // Layer 1: Soft outer glow (animated pulse)
        svgContent += `
          <polygon
            points="${points}"
            fill="none"
            stroke="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)"
            stroke-width="1.5"
            class="room-selected-glow"
            style="pointer-events: none; filter: blur(0.8px);"
          />
        `;

        // Layer 2: Radial gradient base fill
        svgContent += `
          <polygon
            points="${points}"
            fill="url(#glow-${room.id})"
            stroke="none"
            style="pointer-events: none;"
          />
        `;

        // Layer 3: Diagonal stripes overlay
        svgContent += `
          <polygon
            points="${points}"
            data-room="${room.id}"
            fill="url(#stripe-${room.id})"
            stroke="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)"
            stroke-width="0.4"
            stroke-linejoin="round"
            style="cursor: pointer; pointer-events: all;"
            filter="url(#outer-glow-${room.id})"
          />
        `;

        // Layer 4: Corner brackets for high-tech look
        const bracketSize = Math.min(bounds.width, bounds.height) * 0.15;
        const bracketOffset = 0.3;
        svgContent += this._buildCornerBrackets(polygon, rgb, bracketSize, bracketOffset);

        // Layer 5: Room label with background pill and fade-in + pulse animation
        const labelBgWidth = room.name.length * 1.6 + 3;
        const labelBgHeight = 4;
        svgContent += `
          <rect
            x="${center.x - labelBgWidth / 2}"
            y="${center.y - labelBgHeight / 2}"
            width="${labelBgWidth}"
            height="${labelBgHeight}"
            rx="1"
            ry="1"
            fill="rgba(0, 0, 0, 0.7)"
            class="room-label-selected"
            style="pointer-events: none;"
          />
          <text
            x="${center.x}"
            y="${center.y}"
            fill="white"
            font-size="2.5"
            font-weight="600"
            text-anchor="middle"
            dominant-baseline="middle"
            class="room-label-selected"
            style="pointer-events: none;"
          >${room.name}</text>
        `;

      } else if (isHovered) {
        // === HOVERED STATE: Subtle highlight with animated label ===
        svgContent += `
          <polygon
            points="${points}"
            data-room="${room.id}"
            fill="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)"
            stroke="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)"
            stroke-width="0.3"
            stroke-linejoin="round"
            style="cursor: pointer; pointer-events: all;"
          />
        `;
        // Hover label with background pill and fade-in
        const hoverBgWidth = room.name.length * 1.5 + 2.5;
        const hoverBgHeight = 3.5;
        svgContent += `
          <rect
            x="${center.x - hoverBgWidth / 2}"
            y="${center.y - hoverBgHeight / 2}"
            width="${hoverBgWidth}"
            height="${hoverBgHeight}"
            rx="0.8"
            ry="0.8"
            fill="rgba(0, 0, 0, 0.6)"
            class="room-label-hover"
            style="pointer-events: none;"
          />
          <text
            x="${center.x}"
            y="${center.y}"
            fill="rgba(255, 255, 255, 0.95)"
            font-size="2.2"
            font-weight="500"
            text-anchor="middle"
            dominant-baseline="middle"
            class="room-label-hover"
            style="pointer-events: none;"
          >${room.name}</text>
        `;
      } else {
        // === DEFAULT STATE: Nearly invisible, clickable ===
        svgContent += `
          <polygon
            points="${points}"
            data-room="${room.id}"
            fill="rgba(255, 255, 255, 0.015)"
            stroke="transparent"
            stroke-width="0"
            style="cursor: pointer; pointer-events: all;"
          />
        `;
      }
    }

    return svgContent;
  }

  _getPolygonBounds(polygon) {
    const xs = polygon.map(p => p.x);
    const ys = polygon.map(p => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys)
    };
  }

  _buildCornerBrackets(polygon, rgb, size, offset) {
    // Find the bounding box corners and add stylish bracket marks
    const bounds = this._getPolygonBounds(polygon);
    const { minX, maxX, minY, maxY } = bounds;
    const s = size;
    const o = offset;

    const bracketColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
    const bracketWidth = '0.25';

    // Top-left bracket
    let brackets = `
      <polyline points="${minX + o},${minY + s + o} ${minX + o},${minY + o} ${minX + s + o},${minY + o}"
        fill="none" stroke="${bracketColor}" stroke-width="${bracketWidth}" stroke-linecap="round" style="pointer-events: none;"/>
    `;
    // Top-right bracket
    brackets += `
      <polyline points="${maxX - s - o},${minY + o} ${maxX - o},${minY + o} ${maxX - o},${minY + s + o}"
        fill="none" stroke="${bracketColor}" stroke-width="${bracketWidth}" stroke-linecap="round" style="pointer-events: none;"/>
    `;
    // Bottom-left bracket
    brackets += `
      <polyline points="${minX + o},${maxY - s - o} ${minX + o},${maxY - o} ${minX + s + o},${maxY - o}"
        fill="none" stroke="${bracketColor}" stroke-width="${bracketWidth}" stroke-linecap="round" style="pointer-events: none;"/>
    `;
    // Bottom-right bracket
    brackets += `
      <polyline points="${maxX - s - o},${maxY - o} ${maxX - o},${maxY - o} ${maxX - o},${maxY - s - o}"
        fill="none" stroke="${bracketColor}" stroke-width="${bracketWidth}" stroke-linecap="round" style="pointer-events: none;"/>
    `;

    return brackets;
  }

  _handleMapPolygonClick(e) {
    // Find which polygon was clicked by checking data-room attribute
    const target = e.target.closest('polygon[data-room]');
    if (target) {
      const roomId = target.getAttribute('data-room');
      this._handleRoomZoneClick(e, roomId);
    }
  }

  _handleMapPolygonHover(e) {
    // Find which polygon is being hovered
    const target = e.target.closest('polygon[data-room]');
    const roomId = target ? target.getAttribute('data-room') : null;
    if (this._hoveredRoom !== roomId) {
      this._hoveredRoom = roomId;
      this.requestUpdate();
    }
  }

  _renderHtmlGrid() {
    // HTML-based grid that doesn't get distorted
    const lines = [];
    for (let i = 10; i < 100; i += 10) {
      const isMajor = i % 20 === 0;
      lines.push(html`
        <div class="grid-line vertical ${isMajor ? 'major' : ''}" style="left: ${i}%;"></div>
        <div class="grid-line horizontal ${isMajor ? 'major' : ''}" style="top: ${i}%;"></div>
      `);
    }
    return html`<div class="map-edit-grid-html">${lines}</div>`;
  }

  _renderEditGrid() {
    // Legacy SVG grid - kept for reference but not used (gets distorted)
    const lines = [];
    // Minor grid lines every 5%
    for (let i = 5; i < 100; i += 5) {
      const isMajor = i % 20 === 0;
      lines.push(html`
        <line class="${isMajor ? 'major' : ''}" x1="${i}" y1="0" x2="${i}" y2="100" />
        <line class="${isMajor ? 'major' : ''}" x1="0" y1="${i}" x2="100" y2="${i}" />
      `);
    }
    return html`<g class="map-edit-grid">${lines}</g>`;
  }

  _renderMapEditorControls(rooms, allPolygons) {
    return html`
      <div class="map-editor-controls">
        <!-- Room selection row -->
        <div class="map-editor-rooms-row">
          <span class="map-editor-label">Select Room:</span>
          <div class="map-editor-room-chips">
            ${rooms.map(room => html`
              <button
                class="map-editor-room-chip ${this._editingRoom === room.id ? 'active' : ''} ${allPolygons[room.id]?.length >= 3 ? 'has-polygon' : ''}"
                @click="${() => this._selectRoomForEdit(room.id)}"
              >
                ${room.name}
              </button>
            `)}
          </div>
        </div>

        <!-- Actions row -->
        <div class="map-editor-actions-row">
          <div class="map-editor-toggle-row">
            <span class="map-editor-toggle-label">Grid</span>
            <div class="toggle-switch small ${this._showGrid ? 'on' : ''}"
                 @click="${() => this._showGrid = !this._showGrid}">
            </div>
          </div>

          <button class="map-editor-btn"
                  ?disabled="${this._undoStack.length === 0}"
                  @click="${this._undoEdit}">
            ↶ Undo
          </button>
          <button class="map-editor-btn"
                  ?disabled="${this._redoStack.length === 0}"
                  @click="${this._redoEdit}">
            ↷ Redo
          </button>

          ${this._editingRoom ? html`
            <button class="map-editor-btn danger"
                    @click="${this._clearCurrentRoom}">
              🗑️ Clear
            </button>
          ` : ''}

          <button class="map-editor-btn primary"
                  @click="${this._exportPolygons}">
            📋 Copy Config
          </button>
        </div>
      </div>
    `;
  }

  // Keep old method for compatibility
  _renderMapEditorSidebar(rooms, allPolygons) {
    return this._renderMapEditorControls(rooms, allPolygons);
  }

  _getPolygonCenter(polygon) {
    if (!polygon || polygon.length === 0) return { x: 50, y: 50 };
    const sumX = polygon.reduce((sum, p) => sum + p.x, 0);
    const sumY = polygon.reduce((sum, p) => sum + p.y, 0);
    return { x: sumX / polygon.length, y: sumY / polygon.length };
  }

  // Default room colors matching the configurator
  _getRoomColor(roomId) {
    const defaultColors = {
      living_room: '#3B82F6',
      kitchen: '#F97316',
      media_room: '#8B5CF6',
      hallway: '#6B7280',
      entryway: '#84CC16',
      master_bedroom: '#EC4899',
      guest_bedroom: '#14B8A6',
      master_robe: '#F472B6',
      bathroom: '#06B6D4',
      ensuite: '#0EA5E9',
      laundry: '#A855F7',
      office: '#EAB308',
      beauty_room: '#F43F5E'
    };
    return defaultColors[roomId] || '#6B7280';
  }

  // Convert hex color to RGB object
  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 107, g: 114, b: 128 }; // fallback gray
  }

  // Calculate the actual rendered image bounds within the container
  // This accounts for object-fit: contain letterboxing
  _getImageBounds() {
    const mapContainer = this.shadowRoot?.querySelector('.map-container');
    const mapImage = this.shadowRoot?.querySelector('.map-image');

    if (!mapContainer || !mapImage) {
      return { offsetX: 0, offsetY: 0, width: 100, height: 100, valid: false };
    }

    const containerRect = mapContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Get the natural (intrinsic) dimensions of the image
    const naturalWidth = mapImage.naturalWidth || containerWidth;
    const naturalHeight = mapImage.naturalHeight || containerHeight;

    if (naturalWidth === 0 || naturalHeight === 0) {
      return { offsetX: 0, offsetY: 0, width: containerWidth, height: containerHeight, valid: false };
    }

    // Calculate how the image is scaled with object-fit: contain
    const containerAspect = containerWidth / containerHeight;
    const imageAspect = naturalWidth / naturalHeight;

    let renderedWidth, renderedHeight, offsetX, offsetY;

    if (imageAspect > containerAspect) {
      // Image is wider than container - letterbox on top/bottom
      renderedWidth = containerWidth;
      renderedHeight = containerWidth / imageAspect;
      offsetX = 0;
      offsetY = (containerHeight - renderedHeight) / 2;
    } else {
      // Image is taller than container - letterbox on sides
      renderedHeight = containerHeight;
      renderedWidth = containerHeight * imageAspect;
      offsetX = (containerWidth - renderedWidth) / 2;
      offsetY = 0;
    }

    return {
      offsetX,
      offsetY,
      width: renderedWidth,
      height: renderedHeight,
      containerWidth,
      containerHeight,
      valid: true
    };
  }

  // Convert client coordinates to percentage coordinates within the actual image bounds
  _clientToImagePercent(clientX, clientY) {
    const bounds = this._getImageBounds();
    const mapContainer = this.shadowRoot?.querySelector('.map-container');
    if (!mapContainer || !bounds.valid) {
      // Fallback to simple container-based calculation
      const rect = mapContainer?.getBoundingClientRect() || { left: 0, top: 0, width: 100, height: 100 };
      return {
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100
      };
    }

    const containerRect = mapContainer.getBoundingClientRect();

    // Calculate position relative to the actual image (not the container)
    const relativeX = clientX - containerRect.left - bounds.offsetX;
    const relativeY = clientY - containerRect.top - bounds.offsetY;

    // Convert to percentage of image dimensions
    const percentX = (relativeX / bounds.width) * 100;
    const percentY = (relativeY / bounds.height) * 100;

    return { x: percentX, y: percentY };
  }

  _toggleMapEditMode() {
    this._mapEditMode = !this._mapEditMode;
    if (!this._mapEditMode) {
      // Exiting edit mode - save current polygon if any
      this._saveCurrentPolygon();
      this._editingRoom = null;
      this._currentPolygon = [];
      this._dragPointIndex = -1;
    }
  }

  _selectRoomForEdit(roomId) {
    // Save current polygon first
    this._saveCurrentPolygon();

    this._editingRoom = roomId;

    // Load existing polygon for editing, or start fresh
    const allPolygons = { ...(this.config.room_polygons || {}), ...this._roomPolygons };
    if (allPolygons[roomId]) {
      this._currentPolygon = [...allPolygons[roomId]];
    } else {
      this._currentPolygon = [];
    }
  }

  _saveCurrentPolygon() {
    console.log('_saveCurrentPolygon called. editingRoom:', this._editingRoom, 'currentPolygon length:', this._currentPolygon.length);

    if (this._editingRoom && this._currentPolygon.length >= 3) {
      // Push to undo stack
      this._pushUndo();

      // Save the polygon - create new object reference to trigger reactivity
      const newPolygons = {
        ...this._roomPolygons,
        [this._editingRoom]: [...this._currentPolygon]
      };
      this._roomPolygons = newPolygons;

      console.log('SAVED! polygon for', this._editingRoom, ':', this._roomPolygons[this._editingRoom]);
      console.log('this._roomPolygons now:', JSON.stringify(this._roomPolygons));

      // Force update
      this.requestUpdate();
    } else {
      console.log('NOT SAVED - conditions not met');
    }
  }

  _closeCurrentPolygon() {
    // Called when clicking the first point to close the polygon
    if (this._currentPolygon.length >= 3) {
      this._saveCurrentPolygon();
      this._currentPolygon = [];
      this._justClosedPolygon = true; // Flag to prevent click from adding new point
      this.requestUpdate();
      // Clear the flag after a short delay (to catch the click event)
      setTimeout(() => { this._justClosedPolygon = false; }, 100);
    }
  }

  _handleSvgClick(e) {
    // This handles clicks on the SVG overlay
    e.stopPropagation(); // Prevent bubbling to map container (avoid double-add)

    if (!this._mapEditMode || !this._editingRoom) return;
    if (this._dragPointIndex >= 0) return; // Don't add point while dragging
    if (this._justClosedPolygon) return; // Don't add point right after closing

    // Calculate coordinates relative to the map image
    // Image maintains natural aspect ratio, SVG overlay matches with preserveAspectRatio="meet"
    const mapContainer = this.shadowRoot.querySelector('.map-container');
    if (!mapContainer) return;

    const rect = mapContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp to valid range (0-100)
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      return;
    }

    // Check if clicking near first point to close polygon (like irrigation configurator)
    if (this._currentPolygon.length >= 3) {
      const firstPoint = this._currentPolygon[0];
      // Calculate distance in percentage units (same coordinate system)
      const dist = Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2));
      // If within ~3% of first point (roughly 20-30 pixels on a 800px wide container)
      if (dist < 3) {
        this._closeCurrentPolygon();
        return;
      }
    }

    // Add point to current polygon
    const newPoint = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    this._currentPolygon = [...this._currentPolygon, newPoint];
    console.log('Added point:', newPoint, 'Total points:', this._currentPolygon.length);

    // Trigger re-render
    this.requestUpdate();
  }

  _handleSvgDoubleClick(e) {
    // Double-click to close polygon (alternative to clicking first point)
    if (!this._mapEditMode || !this._editingRoom) return;
    if (this._currentPolygon.length >= 3) {
      e.stopPropagation();
      e.preventDefault();
      this._closeCurrentPolygon();
    }
  }

  _handleMapClick(e) {
    // This is a backup handler on the container - SVG click should handle most cases
    if (!this._mapEditMode || !this._editingRoom) return;
    // Delegate to svg click handler
    this._handleSvgClick(e);
  }

  _handleRoomZoneClick(e, roomId) {
    e.stopPropagation();

    if (this._mapEditMode) {
      // In edit mode, select this room for editing
      this._selectRoomForEdit(roomId);
    } else {
      // In normal mode, toggle room selection
      this._toggleRoom(roomId);
    }
  }

  _startDragPoint(e, index) {
    e.stopPropagation();
    e.preventDefault();
    this._dragPointIndex = index;
    this._dragStartPos = { x: e.clientX, y: e.clientY };
    this._didDrag = false;
  }

  _handlePointMouseDown(e, index, canClose) {
    e.stopPropagation();
    e.preventDefault();

    // If this is the closeable first point, close the polygon immediately
    if (canClose) {
      this._closeCurrentPolygon();
      return;
    }

    // Otherwise start dragging
    this._dragPointIndex = index;
    this._dragStartPos = { x: e.clientX, y: e.clientY };
    this._didDrag = false;
  }

  _startDragExistingPoint(e, index) {
    e.stopPropagation();
    e.preventDefault();

    // Load existing polygon into current for editing
    const allPolygons = { ...(this.config.room_polygons || {}), ...this._roomPolygons };
    if (this._editingRoom && allPolygons[this._editingRoom]) {
      this._currentPolygon = [...allPolygons[this._editingRoom]];
    }

    this._dragPointIndex = index;
  }

  _handleMapMouseMove(e) {
    if (this._dragPointIndex < 0 || !this._mapEditMode) return;

    // Check if we've moved enough to count as a drag (5px threshold)
    if (this._dragStartPos) {
      const dx = Math.abs(e.clientX - this._dragStartPos.x);
      const dy = Math.abs(e.clientY - this._dragStartPos.y);
      if (dx > 5 || dy > 5) {
        this._didDrag = true;
      }
    }

    // Only move the point if we're actually dragging
    if (!this._didDrag) return;

    // Find the map container for coordinate calculation
    const mapContainer = this.shadowRoot.querySelector('.map-container');
    if (!mapContainer) return;

    const rect = mapContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update point position in whichever polygon we're editing
    if (this._currentPolygon.length > 0) {
      // Editing new polygon being drawn
      const newPolygon = [...this._currentPolygon];
      newPolygon[this._dragPointIndex] = {
        x: Math.round(Math.max(0, Math.min(100, x)) * 10) / 10,
        y: Math.round(Math.max(0, Math.min(100, y)) * 10) / 10
      };
      this._currentPolygon = newPolygon;
    } else if (this._roomPolygons[this._editingRoom]) {
      // Editing existing polygon
      const newPolygon = [...this._roomPolygons[this._editingRoom]];
      newPolygon[this._dragPointIndex] = {
        x: Math.round(Math.max(0, Math.min(100, x)) * 10) / 10,
        y: Math.round(Math.max(0, Math.min(100, y)) * 10) / 10
      };
      this._roomPolygons = {
        ...this._roomPolygons,
        [this._editingRoom]: newPolygon
      };
    }
    this.requestUpdate();
  }

  _handleSvgMouseMove(e) {
    // Delegate to map container handler for unified coordinate handling
    this._handleMapMouseMove(e);
  }

  _handleSvgMouseUp(e) {
    if (this._dragPointIndex >= 0) {
      const clickedIndex = this._dragPointIndex;
      const wasDrag = this._didDrag;

      this._dragPointIndex = -1;
      this._dragStartPos = null;
      this._didDrag = false;

      // If it was a click (not a drag) on the first point with 3+ points, close the polygon
      if (!wasDrag && clickedIndex === 0 && this._currentPolygon.length >= 3) {
        this._closeCurrentPolygon();
        return;
      }

      // Auto-save after actual drag
      if (wasDrag && this._currentPolygon.length >= 3) {
        this._roomPolygons = {
          ...this._roomPolygons,
          [this._editingRoom]: [...this._currentPolygon]
        };
      }
      this.requestUpdate();
    }
  }

  _handleMapMouseUp(e) {
    this._handleSvgMouseUp(e);
  }

  _handleMapMouseLeave(e) {
    this._handleSvgMouseUp(e);
  }

  _pushUndo() {
    this._undoStack = [...this._undoStack, {
      room: this._editingRoom,
      polygon: this._roomPolygons[this._editingRoom] ? [...this._roomPolygons[this._editingRoom]] : null
    }];
    this._redoStack = []; // Clear redo on new action
  }

  _undoEdit() {
    if (this._undoStack.length === 0) return;

    const lastAction = this._undoStack[this._undoStack.length - 1];

    // Push current state to redo
    this._redoStack = [...this._redoStack, {
      room: lastAction.room,
      polygon: this._roomPolygons[lastAction.room] ? [...this._roomPolygons[lastAction.room]] : null
    }];

    // Restore previous state
    if (lastAction.polygon) {
      this._roomPolygons = { ...this._roomPolygons, [lastAction.room]: lastAction.polygon };
    } else {
      const newPolygons = { ...this._roomPolygons };
      delete newPolygons[lastAction.room];
      this._roomPolygons = newPolygons;
    }

    // If editing the same room, update current polygon
    if (this._editingRoom === lastAction.room) {
      this._currentPolygon = lastAction.polygon ? [...lastAction.polygon] : [];
    }

    this._undoStack = this._undoStack.slice(0, -1);
  }

  _redoEdit() {
    if (this._redoStack.length === 0) return;

    const redoAction = this._redoStack[this._redoStack.length - 1];

    // Push current state to undo
    this._undoStack = [...this._undoStack, {
      room: redoAction.room,
      polygon: this._roomPolygons[redoAction.room] ? [...this._roomPolygons[redoAction.room]] : null
    }];

    // Apply redo state
    if (redoAction.polygon) {
      this._roomPolygons = { ...this._roomPolygons, [redoAction.room]: redoAction.polygon };
    } else {
      const newPolygons = { ...this._roomPolygons };
      delete newPolygons[redoAction.room];
      this._roomPolygons = newPolygons;
    }

    // If editing the same room, update current polygon
    if (this._editingRoom === redoAction.room) {
      this._currentPolygon = redoAction.polygon ? [...redoAction.polygon] : [];
    }

    this._redoStack = this._redoStack.slice(0, -1);
  }

  _clearCurrentRoom() {
    if (!this._editingRoom) return;

    this._pushUndo();

    const newPolygons = { ...this._roomPolygons };
    delete newPolygons[this._editingRoom];
    this._roomPolygons = newPolygons;
    this._currentPolygon = [];
  }

  _exportPolygons() {
    const allPolygons = { ...(this.config.room_polygons || {}), ...this._roomPolygons };

    // Format as YAML for card config
    let yaml = 'room_polygons:\n';
    for (const [roomId, points] of Object.entries(allPolygons)) {
      if (points && points.length >= 3) {
        yaml += `  ${roomId}:\n`;
        points.forEach(p => {
          yaml += `    - { x: ${p.x}, y: ${p.y} }\n`;
        });
      }
    }

    // Copy to clipboard
    navigator.clipboard.writeText(yaml).then(() => {
      // Show brief confirmation
      alert('Room polygon configuration copied to clipboard!\n\nPaste this into your card configuration YAML.');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback: show in console
      console.log('Room Polygons YAML:\n', yaml);
      alert('Could not copy to clipboard. Check browser console for the YAML.');
    });
  }

  _renderStatusBar(hasError, errorDescription, battery, areaCleaned, cleaningDuration) {
    const totalCleans = this._getStateValue(this.config.total_cleanings_entity, "—");

    return html`
      <div class="status-bar">
        <div class="status-bar-left ${hasError ? 'error' : ''}">
          <span class="status-bar-icon">${hasError ? '⚠️' : '✅'}</span>
          <span class="status-bar-text">${hasError ? this._formatError(errorDescription) : 'Operational'}</span>
        </div>
        <div class="status-bar-stats">
          <div class="status-bar-stat">
            <span class="status-bar-stat-icon">🔋</span>
            <span class="status-bar-stat-value">${battery}%</span>
          </div>
          <div class="status-bar-stat">
            <span class="status-bar-stat-icon">📐</span>
            <span class="status-bar-stat-value">${Math.round(parseFloat(areaCleaned))} m²</span>
          </div>
          <div class="status-bar-stat">
            <span class="status-bar-stat-icon">⏱️</span>
            <span class="status-bar-stat-value">${Math.round(parseFloat(cleaningDuration))} min</span>
          </div>
          ${totalCleans !== "—" ? html`
            <div class="status-bar-stat">
              <span class="status-bar-stat-icon">🧹</span>
              <span class="status-bar-stat-value">${totalCleans}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _renderStats(battery, areaCleaned, cleaningDuration) {
    // Kept for backwards compatibility but not used in new layout
    return html``;
  }

  _renderStatusPanel(hasError, errorDescription, lastRun) {
    // Kept for backwards compatibility but not used in new layout
    return html``;
  }

  _renderMaintenanceQuick(filterLife, mainBrushLife, sideBrushLife) {
    const items = [
      { label: "Filter", value: filterLife, icon: "🔲" },
      { label: "Main Brush", value: mainBrushLife, icon: "🧹" },
      { label: "Side Brush", value: sideBrushLife, icon: "💫" },
    ];

    // Check for any alerts
    const alerts = items.filter(item => {
      const alert = this._getMaintenanceAlert(item.value);
      return alert !== null;
    });

    return html`
      <div class="panel">
        <h3 class="panel-title">
          <span class="panel-title-icon">🔧</span>
          Maintenance
          ${alerts.length > 0 ? html`<span style="color: var(--vac-accent-yellow); margin-left: auto;">⚠️ ${alerts.length}</span>` : ''}
        </h3>
        <div class="stats-row">
          ${items.map(item => {
            const alert = this._getMaintenanceAlert(item.value);
            return html`
              <div class="stat-card ${this._getMaintenanceItemClass(item.value)}">
                <div class="stat-card-icon">${item.icon}</div>
                <div class="stat-card-value">${item.value}%</div>
                <div class="stat-card-label">
                  ${item.label}
                  ${alert ? html`<br><span style="color: ${alert.class === 'critical' ? 'var(--vac-accent-red)' : 'var(--vac-accent-yellow)'}; font-size: 9px;">${alert.icon} ${alert.text}</span>` : ''}
                </div>
                <div class="stat-card-bar ${this._getMaintenanceClass(item.value)}"
                     style="width: ${item.value}%"></div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  _renderTabbedInterface(filterLife, mainBrushLife, sideBrushLife) {
    // Check for maintenance alerts
    const maintenanceItems = [
      { value: filterLife },
      { value: mainBrushLife },
      { value: sideBrushLife },
    ];
    const alertCount = maintenanceItems.filter(item => parseFloat(item.value) < 30).length;

    const tabs = [
      { id: 'rooms', name: 'Rooms', icon: '🏠' },
      { id: 'schedule', name: 'Schedule', icon: '📅' },
      { id: 'settings', name: 'Settings', icon: '⚙️' },
      { id: 'maintenance', name: 'Maint.', icon: '🔧', alert: alertCount > 0 },
    ];

    return html`
      <div class="panel tabbed-panel">
        <div class="tabs-container">
          <div class="tabs-header">
            ${tabs.map(tab => html`
              <button class="tab-button ${this._activeTab === tab.id ? 'active' : ''}"
                      @click="${() => { this._activeTab = tab.id; this.requestUpdate(); }}">
                <span class="tab-icon">${tab.icon}</span>
                ${tab.name}
                ${tab.alert ? html`<span class="tab-alert">!</span>` : ''}
              </button>
            `)}
          </div>
        </div>
        <div class="tab-content">
          ${this._activeTab === 'rooms' ? this._renderRoomsTab() : ''}
          ${this._activeTab === 'schedule' ? this._renderScheduleTab() : ''}
          ${this._activeTab === 'settings' ? this._renderSettingsTab() : ''}
          ${this._activeTab === 'maintenance' ? this._renderMaintenanceTab(filterLife, mainBrushLife, sideBrushLife) : ''}
        </div>
      </div>
    `;
  }

  _renderRoomsTab() {
    const rooms = this._getRooms();
    const presets = this._getPresets();

    return html`
      <!-- Quick Presets Row -->
      <div class="presets-in-tab">
        ${presets.map(preset => html`
          <div class="preset-chip ${preset.class} ${this._activePreset === preset.id ? 'active' : ''}"
               @click="${() => this._handlePreset(preset.id)}">
            <span class="preset-chip-icon">${preset.icon}</span>
            ${preset.name}
            <span class="preset-chip-count">(${preset.rooms.length})</span>
          </div>
        `)}
      </div>

      <!-- Room Grid -->
      <div class="rooms-grid">
        ${rooms.map(room => {
          const isSelected = this._selectedRooms.includes(room.id);
          const isPresetHighlight = this._activePreset && presets.find(p => p.id === this._activePreset)?.rooms.includes(room.id);

          return html`
            <div class="room-chip ${isSelected ? 'selected' : ''} ${isPresetHighlight && !isSelected ? 'preset-highlight' : ''}"
                 @click="${() => this._toggleRoom(room.id)}">
              <span class="room-chip-icon">${room.icon}</span>
              <span class="room-chip-name">${room.name}</span>
              <span class="room-chip-check">✓</span>
            </div>
          `;
        })}
      </div>

      <!-- Actions -->
      <div class="room-actions">
        <button class="room-action-btn danger" @click="${() => this._clearAllRooms()}">
          ✕ Clear All
        </button>
        <button class="room-action-btn primary" @click="${() => this._openCleaningModal()}">
          🤖 Clean ${this._selectedRooms.length > 0 ? `${this._selectedRooms.length} Rooms` : 'Selected'}
        </button>
      </div>
    `;
  }

  // ============================================
  // CLEANING MODAL METHODS
  // ============================================

  _openCleaningModal() {
    // Reset modal dropdown states (will read current values from HA)
    this._modalFanSpeed = null;
    this._modalWorkMode = null;
    this._modalWaterFlow = null;
    this._openDropdown = null;
    this._showCleaningModal = true;
    this.requestUpdate();
  }

  _closeCleaningModal(clearSelection = true) {
    this._showCleaningModal = false;

    if (clearSelection) {
      // Clear all selected rooms and turn off input_booleans
      const rooms = this._getRooms();
      rooms.forEach(room => {
        if (room.input_boolean) {
          this.hass.callService("input_boolean", "turn_off", {
            entity_id: room.input_boolean
          });
        }
      });
      this._selectedRooms = [];
      this._activePreset = null;
    }

    this.requestUpdate();
  }

  _renderCleaningModal() {
    const rooms = this._getRooms();
    const selectedRooms = rooms.filter(r => this._selectedRooms.includes(r.id));

    // Get current settings values
    const fanSpeedEntity = this.config.fan_speed_entity;
    const workModeEntity = this.config.work_mode_entity;
    const waterFlowEntity = this.config.water_flow_entity;

    const currentFanSpeed = this._modalFanSpeed || (fanSpeedEntity ? this._getStateValue(fanSpeedEntity, 'Normal') : 'Normal');
    const currentWorkMode = this._modalWorkMode || (workModeEntity ? this._getStateValue(workModeEntity, 'vacuum_and_mop') : 'vacuum_and_mop');
    const currentWaterFlow = this._modalWaterFlow || (waterFlowEntity ? this._getStateValue(waterFlowEntity, 'Medium') : 'Medium');

    // Get options for each setting
    const fanSpeedOptions = fanSpeedEntity ? this._getSelectOptions(fanSpeedEntity) : ['Quiet', 'Normal', 'Max', 'Max+'];
    const workModeOptions = workModeEntity ? this._getSelectOptions(workModeEntity) : ['vacuum', 'mop', 'vacuum_and_mop', 'mop_after_vacuum'];
    const waterFlowOptions = waterFlowEntity ? this._getSelectOptions(waterFlowEntity) : ['Low', 'Medium', 'High', 'Very High'];

    // Format work mode display
    const formatWorkMode = (mode) => {
      const modes = {
        'vacuum': '🧹 Vacuum Only',
        'mop': '💧 Mop Only',
        'vacuum_and_mop': '🧹💧 Vacuum & Mop',
        'mop_after_vacuum': '🔄 Mop After Vacuum'
      };
      return modes[mode] || mode;
    };

    // Format fan speed display
    const formatFanSpeed = (speed) => {
      const icons = {
        'Quiet': '🔇',
        'Normal': '🔉',
        'Max': '🔊',
        'Max+': '📢'
      };
      return `${icons[speed] || '🔉'} ${speed}`;
    };

    // Format water flow display
    const formatWaterFlow = (flow) => {
      const icons = {
        'Low': '💧',
        'Medium': '💦',
        'High': '🌊',
        'Very High': '🌊🌊'
      };
      return `${icons[flow] || '💦'} ${flow}`;
    };

    // Render custom dropdown
    const renderDropdown = (id, options, currentValue, formatter) => {
      const isOpen = this._openDropdown === id;
      return html`
        <div class="custom-dropdown">
          <div class="custom-dropdown-trigger ${isOpen ? 'open' : ''}"
               @click="${(e) => { e.stopPropagation(); this._toggleDropdown(id); }}">
            <span class="custom-dropdown-value">${formatter(currentValue)}</span>
            <span class="custom-dropdown-arrow">▼</span>
          </div>
          <div class="custom-dropdown-menu ${isOpen ? 'open' : ''}">
            ${options.map(opt => html`
              <div class="custom-dropdown-option ${opt === currentValue ? 'selected' : ''}"
                   @click="${(e) => { e.stopPropagation(); this._selectDropdownOption(id, opt); }}">
                ${formatter(opt)}
              </div>
            `)}
          </div>
        </div>
      `;
    };

    return html`
      <div class="cleaning-modal-overlay" @click="${(e) => { if (e.target.classList.contains('cleaning-modal-overlay')) this._closeCleaningModal(); }}">
        <div class="cleaning-modal" @click="${() => this._closeAllDropdowns()}">
          <div class="cleaning-modal-header">
            <div class="cleaning-modal-title">
              <span class="cleaning-modal-icon">🤖</span>
              <div>
                <h2>Start Cleaning</h2>
                <p class="cleaning-modal-subtitle">${selectedRooms.length > 0 ? `${selectedRooms.length} room${selectedRooms.length > 1 ? 's' : ''} selected` : 'Full house clean'}</p>
              </div>
            </div>
            <button class="cleaning-modal-close" @click="${() => this._closeCleaningModal()}">✕</button>
          </div>

          <div class="cleaning-modal-body">
            ${selectedRooms.length > 0 ? html`
              <div class="cleaning-modal-section">
                <h3 class="cleaning-modal-section-title">Rooms to Clean</h3>
                <div class="cleaning-modal-rooms">
                  ${selectedRooms.map(room => html`
                    <div class="cleaning-modal-room-chip" style="--room-color: ${room.color || '#3B82F6'}">
                      <span class="cleaning-modal-room-icon">${room.icon || '🚪'}</span>
                      <span class="cleaning-modal-room-name">${room.name}</span>
                    </div>
                  `)}
                </div>
              </div>
            ` : html`
              <div class="cleaning-modal-section">
                <div class="cleaning-modal-full-house">
                  <span class="cleaning-modal-full-house-icon">🏠</span>
                  <span>Cleaning entire house</span>
                </div>
              </div>
            `}

            <div class="cleaning-modal-section">
              <h3 class="cleaning-modal-section-title">Cleaning Settings</h3>

              <div class="cleaning-modal-setting">
                <label class="cleaning-modal-setting-label">
                  <span class="setting-icon">🌀</span>
                  Fan Speed
                </label>
                ${renderDropdown('fanSpeed', fanSpeedOptions, currentFanSpeed, formatFanSpeed)}
              </div>

              <div class="cleaning-modal-setting">
                <label class="cleaning-modal-setting-label">
                  <span class="setting-icon">⚙️</span>
                  Work Mode
                </label>
                ${renderDropdown('workMode', workModeOptions, currentWorkMode, formatWorkMode)}
              </div>

              <div class="cleaning-modal-setting">
                <label class="cleaning-modal-setting-label">
                  <span class="setting-icon">💧</span>
                  Water Flow
                </label>
                ${renderDropdown('waterFlow', waterFlowOptions, currentWaterFlow, formatWaterFlow)}
              </div>
            </div>
          </div>

          <div class="cleaning-modal-footer">
            <button class="cleaning-modal-btn cancel" @click="${() => this._closeCleaningModal()}">
              Cancel
            </button>
            <button class="cleaning-modal-btn start" @click="${() => this._startCleaningFromModal()}">
              <span class="btn-icon">▶️</span>
              Start Cleaning
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _toggleDropdown(id) {
    this._openDropdown = this._openDropdown === id ? null : id;
    this.requestUpdate();
  }

  _closeAllDropdowns() {
    if (this._openDropdown) {
      this._openDropdown = null;
      this.requestUpdate();
    }
  }

  _selectDropdownOption(id, value) {
    switch(id) {
      case 'fanSpeed':
        this._modalFanSpeed = value;
        break;
      case 'workMode':
        this._modalWorkMode = value;
        break;
      case 'waterFlow':
        this._modalWaterFlow = value;
        break;
    }
    this._openDropdown = null;
    this.requestUpdate();
  }

  // Generic custom dropdown renderer for use across tabs
  _renderCustomDropdown(dropdownId, options, currentValue, formatter, entityId, label = '') {
    const isOpen = this._openDropdown === dropdownId;
    return html`
      <div class="custom-dropdown">
        <div class="custom-dropdown-trigger ${isOpen ? 'open' : ''}"
             @click="${(e) => { e.stopPropagation(); this._toggleDropdown(dropdownId); }}">
          <span class="custom-dropdown-value">${formatter ? formatter(currentValue) : currentValue}</span>
          <span class="custom-dropdown-arrow">▼</span>
        </div>
        <div class="custom-dropdown-menu ${isOpen ? 'open' : ''}">
          ${options.map(opt => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : (formatter ? formatter(opt) : opt);
            return html`
              <div class="custom-dropdown-option ${optValue === currentValue ? 'selected' : ''}"
                   @click="${(e) => { e.stopPropagation(); this._selectGeneralDropdownOption(dropdownId, optValue, entityId); }}">
                ${optLabel}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  _selectGeneralDropdownOption(dropdownId, value, entityId) {
    if (entityId) {
      this._setSelectValue(entityId, value);
    }
    this._openDropdown = null;
    this.requestUpdate();
  }

  _getSelectOptions(entityId) {
    const state = this._getState(entityId);
    if (!state) return [];

    // For input_select entities
    if (state.attributes?.options) {
      return state.attributes.options;
    }

    // For select entities
    if (state.attributes?.options) {
      return state.attributes.options;
    }

    return [];
  }

  async _startCleaningFromModal() {
    // Get selected values from modal state (custom dropdowns)
    const fanSpeedEntity = this.config.fan_speed_entity;
    const workModeEntity = this.config.work_mode_entity;
    const waterFlowEntity = this.config.water_flow_entity;

    const newFanSpeed = this._modalFanSpeed || (fanSpeedEntity ? this._getStateValue(fanSpeedEntity, 'Normal') : 'Normal');
    const newWorkMode = this._modalWorkMode || (workModeEntity ? this._getStateValue(workModeEntity, 'vacuum_and_mop') : 'vacuum_and_mop');
    const newWaterFlow = this._modalWaterFlow || (waterFlowEntity ? this._getStateValue(waterFlowEntity, 'Medium') : 'Medium');

    try {
      // Apply settings first
      const promises = [];

      if (this.config.fan_speed_entity && newFanSpeed) {
        const domain = this.config.fan_speed_entity.split('.')[0];
        promises.push(
          this.hass.callService(domain, 'select_option', {
            entity_id: this.config.fan_speed_entity,
            option: newFanSpeed
          })
        );
      }

      if (this.config.work_mode_entity && newWorkMode) {
        const domain = this.config.work_mode_entity.split('.')[0];
        promises.push(
          this.hass.callService(domain, 'select_option', {
            entity_id: this.config.work_mode_entity,
            option: newWorkMode
          })
        );
      }

      if (this.config.water_flow_entity && newWaterFlow) {
        const domain = this.config.water_flow_entity.split('.')[0];
        promises.push(
          this.hass.callService(domain, 'select_option', {
            entity_id: this.config.water_flow_entity,
            option: newWaterFlow
          })
        );
      }

      // Wait for settings to apply
      if (promises.length > 0) {
        await Promise.all(promises);
        // Small delay to ensure settings are applied
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Close modal without clearing selection (we're starting cleaning with these rooms)
      this._closeCleaningModal(false);

      // Start cleaning
      this._handleAction('start');

    } catch (error) {
      console.error('Error applying cleaning settings:', error);
      // Still try to start cleaning even if settings failed
      this._closeCleaningModal(false);
      this._handleAction('start');
    }
  }

  _selectRoomGroup(roomIds) {
    // Toggle group selection
    const allSelected = roomIds.every(id => this._selectedRooms.includes(id));

    if (allSelected) {
      // Deselect all in group
      this._selectedRooms = this._selectedRooms.filter(id => !roomIds.includes(id));
    } else {
      // Select all in group
      const newSelection = [...new Set([...this._selectedRooms, ...roomIds])];
      this._selectedRooms = newSelection;
    }

    // Update HA input_booleans
    const rooms = this._getRooms();
    roomIds.forEach(roomId => {
      const room = rooms.find(r => r.id === roomId);
      if (room?.input_boolean) {
        const shouldBeOn = this._selectedRooms.includes(roomId);
        this.hass.callService("input_boolean", shouldBeOn ? "turn_on" : "turn_off", {
          entity_id: room.input_boolean
        });
      }
    });

    this._activePreset = null;
    this.requestUpdate();
  }

  _renderScheduleTab() {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayEntities = [
      this.config.schedule_monday_entity,
      this.config.schedule_tuesday_entity,
      this.config.schedule_wednesday_entity,
      this.config.schedule_thursday_entity,
      this.config.schedule_friday_entity,
      this.config.schedule_saturday_entity,
      this.config.schedule_sunday_entity,
    ];
    const zoneAutomations = [
      this.config.zone_automation_monday_entity || 'automation.vacuum_zone_schedule_monday',
      this.config.zone_automation_tuesday_entity || 'automation.vacuum_zone_schedule_tuesday',
      this.config.zone_automation_wednesday_entity || 'automation.vacuum_zone_schedule_wednesday',
      this.config.zone_automation_thursday_entity || 'automation.vacuum_zone_schedule_thursday',
      this.config.zone_automation_friday_entity || 'automation.vacuum_zone_schedule_friday',
      this.config.zone_automation_saturday_entity || 'automation.vacuum_zone_schedule_saturday',
      this.config.zone_automation_sunday_entity || 'automation.vacuum_zone_schedule_sunday',
    ];

    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1; // Convert to Mon=0

    // Get master toggle states
    const zoneScheduleEnabled = this._getStateValue(this.config.zone_schedule_enabled_entity, "off") === "on";
    const dailyEnabled = this._getStateValue(this.config.schedule_daily_entity, "off") === "on";
    const isNightshift = this._getStateValue(this.config.nightshift_entity, "off") === "on";

    // Get times based on nightshift mode
    const normalTime = this._getStateValue(this.config.schedule_time_entity, "10:00");
    const nightshiftTime = this._getStateValue(this.config.schedule_time_nightshift_entity, "14:00");
    const activeTime = isNightshift ? nightshiftTime : normalTime;
    const displayTime = activeTime ? activeTime.substring(0, 5) : "10:00";

    // Get schedule mode
    const scheduleMode = this._getStateValue(this.config.schedule_mode_entity, "Vacuum & Mop");
    const modeDisplay = scheduleMode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Get scheduled rooms for daily cleaning display
    const scheduledRooms = this._getScheduledRooms();
    const activeScheduledRooms = scheduledRooms.filter(r => r.enabled);
    const dailyRoomNames = activeScheduledRooms.length > 0
      ? activeScheduledRooms.slice(0, 3).map(r => r.name.split(' ')[0]).join(', ') + (activeScheduledRooms.length > 3 ? '...' : '')
      : 'All rooms';

    // Detect active errors and categorise
    const errorState = this._getState(this.config.error_entity);
    const errorDesc = errorState?.attributes?.description || "NoError: Robot is operational";
    const hasActiveError = errorDesc !== "NoError: Robot is operational" &&
                           this._getStateValue(this.config.vacuum_entity, "") === "error";

    const isMopError = hasActiveError && (
      errorDesc.includes('FreshWaterBox') || errorDesc.includes('WaterTank') || errorDesc.includes('CleaningPad')
    );
    const isVacuumError = hasActiveError && (
      errorDesc.includes('DustBin') || errorDesc.includes('MainBrush') ||
      errorDesc.includes('SideBrush') || errorDesc.includes('Filter')
    );
    const isGeneralError = hasActiveError && !isMopError && !isVacuumError;

    // Map which days use mopping (Sunday = vacuum_and_mop)
    const mopDays = [6]; // Sunday index (Mon=0)
    // Map which days are vacuum-only (Tue=1, Thu=3)
    const vacuumOnlyDays = [1, 3];

    // Build day schedule info
    const daySchedules = dayNames.map((name, i) => {
      const dayToggleOn = this._getStateValue(dayEntities[i], "off") === "on";
      const zoneAutomationOn = this._getStateValue(zoneAutomations[i], "off") === "on";

      // Check if day has regular daily cleaning
      const hasDaily = dayToggleOn && dailyEnabled;
      // Check if day has zone cleaning
      const hasZone = zoneAutomationOn && zoneScheduleEnabled;

      // Determine if this day is disabled due to an error
      let errorDisabled = false;
      let errorReason = '';
      if (hasActiveError && !dayToggleOn && zoneScheduleEnabled && zoneAutomationOn) {
        // Day toggle is off but zone automation exists and is on - likely disabled by error
        if (isMopError && mopDays.includes(i)) {
          errorDisabled = true;
          errorReason = this._formatError(errorDesc);
        } else if (isVacuumError && vacuumOnlyDays.includes(i)) {
          errorDisabled = true;
          errorReason = this._formatError(errorDesc);
        } else if (isGeneralError) {
          errorDisabled = true;
          errorReason = this._formatError(errorDesc);
        }
      }

      // Get zone description if available
      let zoneRooms = 'Zone cleaning';
      if (this.hass?.states?.[zoneAutomations[i]]) {
        const desc = this.hass.states[zoneAutomations[i]]?.attributes?.description || '';
        if (desc) {
          // Extract room names from description like "Clean bedrooms on Tuesday"
          const match = desc.match(/Clean\s+(.+?)\s+on/i);
          if (match) {
            zoneRooms = match[1].charAt(0).toUpperCase() + match[1].slice(1);
          }
        }
      }

      return {
        name,
        short: dayShort[i],
        index: i,
        hasDaily,
        hasZone,
        isActive: hasDaily || hasZone,
        dayEntity: dayEntities[i],
        zoneEntity: zoneAutomations[i],
        zoneRooms,
        isToday: i === todayIndex,
        errorDisabled,
        errorReason
      };
    });

    return html`
      <!-- Weekly Schedule Title -->
      <div class="schedule-section">
        <div class="schedule-section-title">Weekly Cleaning Schedule</div>
      </div>

      <!-- Weekly Schedule Grid - 2 columns -->
      <div class="schedule-week-grid">
        ${daySchedules.map(day => html`
          <div class="schedule-day-card ${day.isActive ? 'active' : ''} ${day.errorDisabled ? 'error-disabled' : ''} ${day.isToday ? 'today' : ''}">
            <div class="schedule-day-header">
              <span class="schedule-day-icon">${day.errorDisabled ? '⚠️' : day.isActive ? '📅' : '📆'}</span>
              <span class="schedule-day-name ${day.isToday ? 'today-label' : ''}">${day.name}</span>
            </div>
            <div class="schedule-day-details">
              ${day.isActive ? html`
                <div class="schedule-day-time">🕐 ${displayTime} • ${modeDisplay}</div>
                <div class="schedule-day-rooms">
                  ${day.hasZone && !day.hasDaily ? html`
                    <span class="schedule-type-badge zone">🎯 ${day.zoneRooms}</span>
                  ` : html`
                    <span class="schedule-type-badge daily">🏠 ${dailyRoomNames}</span>
                  `}
                </div>
              ` : day.errorDisabled ? html`
                <div class="schedule-day-error">⛔ Disabled: ${day.errorReason}</div>
                <div class="schedule-day-none" style="margin-top: 2px;">${day.zoneRooms}</div>
              ` : html`
                <div class="schedule-day-none">No cleaning scheduled</div>
              `}
            </div>
          </div>
        `)}
      </div>

      <!-- Zone Cleaning Schedule Section -->
      <div class="schedule-section">
        <div class="schedule-section-title">Zone Cleaning Schedule</div>

        <div class="schedule-toggle-row ${zoneScheduleEnabled ? 'active' : ''}"
             @click="${() => this._toggleEntity(this.config.zone_schedule_enabled_entity)}">
          <div class="schedule-toggle-icon">${zoneScheduleEnabled ? '📋' : '📋'}</div>
          <div class="schedule-toggle-content">
            <div class="schedule-toggle-label">Enable Zone Schedule</div>
            <div class="schedule-toggle-sublabel">${zoneScheduleEnabled ? 'Different rooms on different days' : 'Disabled'}</div>
          </div>
          <div class="toggle-switch ${zoneScheduleEnabled ? 'on' : ''}"></div>
        </div>

        <div class="schedule-toggle-row ${dailyEnabled ? 'active' : ''}"
             @click="${() => this._toggleEntity(this.config.schedule_daily_entity)}">
          <div class="schedule-toggle-icon">📅</div>
          <div class="schedule-toggle-content">
            <div class="schedule-toggle-label">Daily Cleaning</div>
            <div class="schedule-toggle-sublabel">${dailyEnabled ? 'On' : 'Off'}</div>
          </div>
          <div class="toggle-switch ${dailyEnabled ? 'on' : ''}"></div>
        </div>
      </div>

      <!-- Daily Cleaning Expandable Settings (when daily is enabled) -->
      ${dailyEnabled ? html`
        <div class="schedule-section expandable ${this._scheduleExpanded ? 'expanded' : ''}">
          <div class="schedule-expand-header" @click="${() => this._toggleScheduleExpanded()}">
            <span>Settings</span>
            <span class="expand-icon">${this._scheduleExpanded ? '▲' : '▼'}</span>
          </div>

          ${this._scheduleExpanded ? html`
            <div class="schedule-expand-content">
              <!-- Time Settings -->
              <div class="schedule-setting-row">
                <div class="schedule-setting-label">
                  <span class="schedule-setting-icon">🕐</span>
                  Cleaning Time (Normal)
                </div>
                <input type="time" class="schedule-time-input"
                       .value="${normalTime?.substring(0, 5) || '10:00'}"
                       @change="${(e) => this._setTimeValue(this.config.schedule_time_entity, e.target.value)}">
              </div>

              <div class="schedule-setting-row">
                <div class="schedule-setting-label">
                  <span class="schedule-setting-icon">🌙</span>
                  Cleaning Time (Night Shift)
                </div>
                <input type="time" class="schedule-time-input"
                       .value="${nightshiftTime?.substring(0, 5) || '14:00'}"
                       @change="${(e) => this._setTimeValue(this.config.schedule_time_nightshift_entity, e.target.value)}">
              </div>

              <!-- Night Shift Toggle -->
              <div class="schedule-toggle-row compact"
                   @click="${() => this._toggleEntity(this.config.nightshift_entity)}">
                <div class="schedule-toggle-content">
                  <div class="schedule-toggle-label">Julia Currently on Night Shift</div>
                </div>
                <div class="toggle-switch ${isNightshift ? 'on' : ''}"></div>
              </div>

              <!-- Cleaning Mode -->
              <div class="schedule-setting-row">
                <div class="schedule-setting-label">
                  <span class="schedule-setting-icon">🤖</span>
                  Cleaning Mode
                </div>
                ${this._renderCustomDropdown(
                  'scheduleMode',
                  [
                    { value: 'vacuum', label: '🧹 Vacuum' },
                    { value: 'mop', label: '💧 Mop' },
                    { value: 'vacuum_and_mop', label: '🧹💧 Vacuum & Mop' }
                  ],
                  scheduleMode,
                  null,
                  this.config.schedule_mode_entity
                )}
              </div>

              <!-- Day of Week Chips -->
              <div class="schedule-day-chips">
                ${dayShort.map((day, i) => {
                  const isOn = this._getStateValue(dayEntities[i], "off") === "on";
                  return html`
                    <div class="day-chip ${isOn ? 'active' : ''}"
                         @click="${() => this._toggleEntity(dayEntities[i])}">
                      <span class="day-chip-icon">${isOn ? '✓' : '○'}</span>
                      <span class="day-chip-name">${day}</span>
                    </div>
                  `;
                })}
              </div>

              <!-- Scheduled Rooms -->
              <div class="schedule-rooms-section">
                <div class="schedule-rooms-title">Scheduled Rooms</div>

                <!-- Quick Select Chips -->
                <div class="schedule-quick-chips">
                  <div class="quick-chip" @click="${() => this._toggleRoomGroup('common')}">
                    <span>🍴</span> Common
                  </div>
                  <div class="quick-chip" @click="${() => this._toggleRoomGroup('beds')}">
                    <span>🛏️</span> Beds
                  </div>
                  <div class="quick-chip" @click="${() => this._toggleRoomGroup('baths')}">
                    <span>🚿</span> Baths
                  </div>
                  <div class="quick-chip" @click="${() => this._toggleRoomGroup('all')}">
                    <span>🏠</span> All
                  </div>
                </div>

                <!-- Room Grid -->
                <div class="schedule-rooms-grid">
                  ${scheduledRooms.map(room => html`
                    <div class="schedule-room-chip ${room.enabled ? 'active' : ''}"
                         @click="${() => this._toggleEntity(room.schedule_boolean)}">
                      <span class="schedule-room-icon">${room.icon}</span>
                      <span class="schedule-room-name">${room.name}</span>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  _toggleScheduleExpanded() {
    this._scheduleExpanded = !this._scheduleExpanded;
    this.requestUpdate();
  }

  _toggleRoomGroup(group) {
    const rooms = this._getRooms();
    let targetRooms = [];

    switch(group) {
      case 'common':
        targetRooms = ['living_room', 'kitchen', 'entryway'];
        break;
      case 'beds':
        targetRooms = ['master_bedroom', 'guest_bedroom', 'master_robe', 'beauty_room', 'office'];
        break;
      case 'baths':
        targetRooms = ['bathroom', 'ensuite'];
        break;
      case 'all':
        targetRooms = rooms.map(r => r.id);
        break;
    }

    // Get current state of target rooms
    const targetRoomObjects = rooms.filter(r => targetRooms.includes(r.id));
    const allOn = targetRoomObjects.every(r =>
      this._getStateValue(r.schedule_boolean, "off") === "on"
    );

    // Toggle all target rooms
    targetRoomObjects.forEach(room => {
      if (room.schedule_boolean) {
        this.hass.callService("input_boolean", allOn ? "turn_off" : "turn_on", {
          entity_id: room.schedule_boolean
        });
      }
    });
  }

  _getModeIcon(mode) {
    switch(mode) {
      case 'Vacuum Only': return '🤖';
      case 'Mop Only': return '🧹';
      case 'Vacuum & Mop': return '✨';
      default: return '🤖';
    }
  }

  _getScheduledRooms() {
    const rooms = this._getRooms();
    return rooms.map(room => ({
      ...room,
      enabled: this._getStateValue(room.schedule_boolean, "off") === "on"
    }));
  }

  _toggleScheduleDay(entityId) {
    if (!entityId) return;
    this._toggleEntity(entityId);
  }

  _toggleEntity(entityId) {
    if (!entityId) return;
    const currentState = this._getStateValue(entityId, "off");
    const domain = entityId.split('.')[0];
    this.hass.callService(domain, currentState === "on" ? "turn_off" : "turn_on", {
      entity_id: entityId
    });
  }

  _setTimeValue(entityId, value) {
    if (!entityId || !value) return;
    this.hass.callService("input_datetime", "set_datetime", {
      entity_id: entityId,
      time: value
    });
  }

  _getNextCleanTime(enabledDays, scheduleTime) {
    const scheduledDays = enabledDays.filter(d => d.enabled).map(d => d.index);
    if (scheduledDays.length === 0) return "Not scheduled";

    const now = new Date();
    const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const [hours, mins] = (scheduleTime || "10:00").split(':').map(Number);

    // Find next scheduled day
    for (let i = 0; i < 7; i++) {
      const checkDay = (todayIndex + i) % 7;
      if (scheduledDays.includes(checkDay)) {
        if (i === 0) {
          // Today - check if time has passed
          const scheduleDate = new Date();
          scheduleDate.setHours(hours, mins, 0, 0);
          if (now < scheduleDate) {
            return `Today at ${scheduleTime}`;
          }
        } else if (i === 1) {
          return `Tomorrow at ${scheduleTime}`;
        } else {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          return `${days[checkDay]} at ${scheduleTime}`;
        }
      }
    }
    // If we checked all days and found none for today onwards, find the first enabled
    const firstEnabled = scheduledDays[0];
    if (firstEnabled !== undefined) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return `${days[firstEnabled]} at ${scheduleTime}`;
    }
    return "Not scheduled";
  }

  _renderSettingsTab() {
    // Get current values
    const fanSpeed = this._getStateValue(this.config.fan_speed_entity, "Normal");
    const workMode = this._getStateValue(this.config.work_mode_entity, "Vacuum & Mop");
    const waterFlow = this._getStateValue(this.config.water_flow_entity, "Medium");
    const volume = parseInt(this._getStateValue(this.config.volume_entity, "50"));

    // Feature toggles
    const features = [
      { id: 'continuous', name: 'Continuous', icon: '🔄', entity: this.config.continuous_entity },
      { id: 'carpet_boost', name: 'Carpet Boost', icon: '🎯', entity: this.config.carpet_boost_entity },
      { id: 'true_detect', name: 'True Detect', icon: '👁️', entity: this.config.true_detect_entity },
      { id: 'advanced', name: 'Advanced', icon: '⚡', entity: this.config.advanced_entity },
      { id: 'clean_pref', name: 'Clean Pref', icon: '✨', entity: this.config.clean_preference_entity },
    ];

    return html`
      <div class="settings-group">
        <div class="settings-group-title">Cleaning Settings</div>

        <div class="setting-row">
          <div class="setting-label">
            <span class="setting-icon">💨</span>
            <span class="setting-name">Fan Speed</span>
          </div>
          ${this._renderCustomDropdown(
            'settingsFanSpeed',
            [
              { value: 'Quiet', label: '🔇 Quiet' },
              { value: 'Normal', label: '🔉 Normal' },
              { value: 'Max', label: '🔊 Max' },
              { value: 'Max+', label: '📢 Max+' }
            ],
            fanSpeed,
            null,
            this.config.fan_speed_entity
          )}
        </div>

        <div class="setting-row">
          <div class="setting-label">
            <span class="setting-icon">🧹</span>
            <span class="setting-name">Work Mode</span>
          </div>
          ${this._renderCustomDropdown(
            'settingsWorkMode',
            [
              { value: 'vacuum', label: '🧹 Vacuum Only' },
              { value: 'mop', label: '💧 Mop Only' },
              { value: 'vacuum_and_mop', label: '🧹💧 Vacuum & Mop' },
              { value: 'mop_after_vacuum', label: '🔄 Mop After Vacuum' }
            ],
            workMode,
            null,
            this.config.work_mode_entity
          )}
        </div>

        <div class="setting-row">
          <div class="setting-label">
            <span class="setting-icon">💧</span>
            <span class="setting-name">Water Flow</span>
          </div>
          ${this._renderCustomDropdown(
            'settingsWaterFlow',
            [
              { value: 'Low', label: '💧 Low' },
              { value: 'Medium', label: '💦 Medium' },
              { value: 'High', label: '🌊 High' },
              { value: 'Very High', label: '🌊🌊 Very High' }
            ],
            waterFlow,
            null,
            this.config.water_flow_entity
          )}
        </div>

        <div class="setting-row">
          <div class="setting-label">
            <span class="setting-icon">🔊</span>
            <span class="setting-name">Volume</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="range" class="setting-slider" min="0" max="10" .value="${volume}"
                   @change="${(e) => this._setNumberValue(this.config.volume_entity, e.target.value)}" />
            <span class="setting-value">${volume}</span>
          </div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-title">Features</div>
        <div class="feature-toggles">
          ${features.map(feature => {
            const isOn = this._getStateValue(feature.entity, "off") === "on";
            return html`
              <div class="feature-toggle ${isOn ? 'on' : ''}"
                   @click="${() => this._toggleEntity(feature.entity)}">
                <span class="feature-toggle-icon">${feature.icon}</span>
                <span class="feature-toggle-name">${feature.name}</span>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  _setSelectValue(entityId, value) {
    if (!entityId) return;
    const domain = entityId.split('.')[0];
    this.hass.callService(domain, "select_option", {
      entity_id: entityId,
      option: value
    });
  }

  _setNumberValue(entityId, value) {
    if (!entityId) return;
    this.hass.callService("number", "set_value", {
      entity_id: entityId,
      value: parseInt(value)
    });
  }

  _renderMaintenanceTab() {
    // Get consumable values
    const consumables = [
      {
        id: 'filter',
        name: 'Filter',
        icon: '🔲',
        entity: this.config.filter_lifespan_entity,
        resetService: 'ecovacs.reset_filter'
      },
      {
        id: 'main_brush',
        name: 'Main Brush',
        icon: '🧹',
        entity: this.config.main_brush_lifespan_entity,
        resetService: 'ecovacs.reset_main_brush'
      },
      {
        id: 'side_brush',
        name: 'Side Brush',
        icon: '💫',
        entity: this.config.side_brush_lifespan_entity,
        resetService: 'ecovacs.reset_side_brush'
      },
    ];

    // Lifetime stats
    const totalCleans = this._getStateValue(this.config.total_cleanings_entity, "—");
    const totalArea = this._getStateValue(this.config.total_area_entity, "—");
    const totalDuration = this._getStateValue(this.config.total_duration_entity, "—");

    return html`
      <div class="maintenance-section">
        <div class="maintenance-section-title">Consumables</div>
        ${consumables.map(item => {
          const value = parseFloat(this._getStateValue(item.entity, "100"));
          const statusClass = this._getMaintenanceClass(value);
          const alert = this._getMaintenanceAlert(value);

          return html`
            <div class="consumable-card ${this._getMaintenanceItemClass(value)}"
                 @click="${() => this._resetConsumable(item)}">
              <div class="consumable-header">
                <div class="consumable-name">
                  <span class="consumable-icon">${item.icon}</span>
                  ${item.name}
                </div>
                <span class="consumable-percent ${statusClass}">${Math.round(value)}%</span>
              </div>
              <div class="consumable-bar">
                <div class="consumable-bar-fill ${statusClass}" style="width: ${value}%"></div>
              </div>
              <div class="consumable-footer">
                <span>Tap to reset after replacement</span>
                ${alert ? html`
                  <span class="consumable-alert ${alert.class}">${alert.icon} ${alert.text}</span>
                ` : ''}
              </div>
            </div>
          `;
        })}
      </div>

      <div class="maintenance-section">
        <div class="maintenance-section-title">Lifetime Statistics</div>
        <div class="lifetime-stats">
          <div class="lifetime-stat">
            <div class="lifetime-stat-value">${totalCleans}</div>
            <div class="lifetime-stat-label">Cleans</div>
          </div>
          <div class="lifetime-stat">
            <div class="lifetime-stat-value">${totalArea !== "—" ? `${Math.round(parseFloat(totalArea))}` : "—"}</div>
            <div class="lifetime-stat-label">m² Total</div>
          </div>
          <div class="lifetime-stat">
            <div class="lifetime-stat-value">${totalDuration !== "—" ? `${Math.round(parseFloat(totalDuration) / 60)}` : "—"}</div>
            <div class="lifetime-stat-label">Hours</div>
          </div>
        </div>
      </div>

      ${totalCleans !== "—" && totalArea !== "—" ? html`
        <div class="maintenance-section">
          <div class="maintenance-section-title">Average Performance</div>
          <div class="lifetime-stats">
            <div class="lifetime-stat">
              <div class="lifetime-stat-value">${(parseFloat(totalArea) / parseFloat(totalCleans)).toFixed(1)}</div>
              <div class="lifetime-stat-label">m² / Clean</div>
            </div>
            <div class="lifetime-stat">
              <div class="lifetime-stat-value">${(parseFloat(totalDuration) / parseFloat(totalCleans)).toFixed(0)}</div>
              <div class="lifetime-stat-label">Min / Clean</div>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  _resetConsumable(item) {
    // Confirm before reset
    if (confirm(`Reset ${item.name} to 100%? Only do this after replacing the ${item.name.toLowerCase()}.`)) {
      // Call reset service - adjust based on your integration
      if (item.resetService) {
        const [domain, service] = item.resetService.split('.');
        this.hass.callService(domain, service, {
          entity_id: this.config.vacuum_entity
        });
      }
    }
  }
}

customElements.define("vacuum-dashboard", VacuumDashboard);

// ============================================
// CARD EDITOR (Basic for Phase 1)
// ============================================

class VacuumDashboardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = config;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    return html`
      <div style="padding: 16px;">
        <p style="color: #9CA3AF; margin-bottom: 16px;">Vacuum Dashboard v2.0 - Phase 1</p>

        <ha-textfield
          label="Vacuum Entity"
          .value="${this.config.vacuum_entity || ''}"
          @change="${(e) => this._valueChanged('vacuum_entity', e.target.value)}"
          style="width: 100%; margin-bottom: 12px;"
        ></ha-textfield>

        <ha-textfield
          label="Battery Entity"
          .value="${this.config.battery_entity || ''}"
          @change="${(e) => this._valueChanged('battery_entity', e.target.value)}"
          style="width: 100%; margin-bottom: 12px;"
        ></ha-textfield>

        <ha-textfield
          label="Map Entity"
          .value="${this.config.map_entity || ''}"
          @change="${(e) => this._valueChanged('map_entity', e.target.value)}"
          style="width: 100%; margin-bottom: 12px;"
        ></ha-textfield>

        <ha-textfield
          label="Title"
          .value="${this.config.title || 'Alfonso Robot Vacuum'}"
          @change="${(e) => this._valueChanged('title', e.target.value)}"
          style="width: 100%; margin-bottom: 12px;"
        ></ha-textfield>

        <ha-textfield
          label="Subtitle"
          .value="${this.config.subtitle || 'Ecovacs Deebot X2 Omni'}"
          @change="${(e) => this._valueChanged('subtitle', e.target.value)}"
          style="width: 100%; margin-bottom: 12px;"
        ></ha-textfield>

        <ha-textfield
          label="Icon"
          .value="${this.config.icon || '🤖'}"
          @change="${(e) => this._valueChanged('icon', e.target.value)}"
          style="width: 100%; margin-bottom: 12px;"
        ></ha-textfield>
      </div>
    `;
  }

  _valueChanged(key, value) {
    const event = new CustomEvent("config-changed", {
      detail: { config: { ...this.config, [key]: value } },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("vacuum-dashboard-editor", VacuumDashboardEditor);

// Register card
window.customCards = window.customCards || [];
window.customCards.push({
  type: "vacuum-dashboard",
  name: "Vacuum Dashboard",
  description: "A comprehensive robot vacuum dashboard with matching irrigation dashboard design",
  preview: true,
  documentationURL: "https://github.com/your-repo/vacuum-dashboard",
});

console.info(
  "%c VACUUM-DASHBOARD %c v2.0.0 - Phase 2 ",
  "background: #1a1f2e; color: #22C55E; font-weight: bold; padding: 4px 0;",
  "background: #22C55E; color: #1a1f2e; font-weight: bold; padding: 4px 0;"
);

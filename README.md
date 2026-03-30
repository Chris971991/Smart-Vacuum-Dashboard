# Smart Vacuum Dashboard

A custom Home Assistant Lovelace card for monitoring and controlling the Ecovacs Deebot X2 Omni robot vacuum. Features a 4-tab interface with room management, scheduling, settings, and maintenance tracking.

Built to match the design language of [Smart Climate Control](https://github.com/) and Lawn Irrigation Dashboard cards.

## Features

- **Rooms Tab** - Select individual rooms or presets, view cleaning history with freshness indicators, interactive map with clickable zones
- **Schedule Tab** - Day-of-week scheduling, night shift mode, quiet hours / Do Not Disturb, zone-based scheduled cleaning
- **Settings Tab** - Fan speed, work mode, water flow, volume, carpet boost, TrueDetect, and more
- **Maintenance Tab** - Consumable lifespan tracking (filter, brushes), replacement date logging, alert thresholds, lifetime statistics
- **Adaptive Controls** - Context-aware actions based on vacuum state (cleaning, docked, returning, error)
- **Battery Status** - Charging progress with ETA
- **Error Tracking** - Error history with human-readable descriptions

## Installation

### 1. Install the Card

Copy `vacuum-dashboard.js` to your Home Assistant instance:

```
config/www/community/vacuum-dashboard/vacuum-dashboard.js
```

Add it as a Lovelace resource in **Settings > Dashboards > Resources**:

| URL | Type |
|-----|------|
| `/local/community/vacuum-dashboard/vacuum-dashboard.js` | JavaScript Module |

### 2. Create Helpers

Add the helpers from [ha-config/helpers/vacuum-helpers.yaml](ha-config/helpers/vacuum-helpers.yaml) to your Home Assistant configuration.

If you already have some helpers configured, check [ha-config/helpers/vacuum-helpers-missing.yaml](ha-config/helpers/vacuum-helpers-missing.yaml) for just the additional ones needed.

### 3. Add Automations

Import the automations from [ha-config/automations/vacuum-room-history-automation.yaml](ha-config/automations/vacuum-room-history-automation.yaml) via **Settings > Automations > Create Automation > Edit in YAML**.

### 4. Add the Dashboard Card

Copy the configuration from [dashboard/vacuum-dashboard-config.yaml](dashboard/vacuum-dashboard-config.yaml) into your Lovelace dashboard. Update the entity IDs to match your vacuum integration.

## Project Structure

```
vacuum-dashboard.js              # Main custom Lovelace card
dashboard/
  vacuum-dashboard-config.yaml   # Card YAML configuration
  vacuum-dashboard-lovelace.yaml # Full Lovelace dashboard view
ha-config/
  helpers/
    vacuum-helpers.yaml          # All required HA input helpers
    vacuum-helpers-missing.yaml  # Delta helpers (if you have some already)
  automations/
    vacuum-room-history-automation.yaml  # Room cleaning history tracking
tools/
  vacuum-room-configurator.html  # Interactive room zone map configurator
```

## Room Zone Configurator

The [tools/vacuum-room-configurator.html](tools/vacuum-room-configurator.html) is a standalone tool for visually mapping room zones onto your vacuum's map image. Open it in a browser, upload your map, draw polygons over each room, and export the coordinates for use in the card config.

## Configuration

See [dashboard/vacuum-dashboard-config.yaml](dashboard/vacuum-dashboard-config.yaml) for the full configuration reference including:

- Core entities (vacuum, battery, map, sensors)
- Maintenance / consumable entities
- Settings entities (fan speed, work mode, toggles)
- Schedule entities (times, day toggles, DND)
- Room definitions with categories
- Preset configurations
- Display options and thresholds

## Requirements

- Home Assistant 2024.1+
- [card-mod](https://github.com/thomasloven/lovelace-card-mod) (for the Lovelace view variant)
- Ecovacs Deebot integration (or adapt entity IDs for your vacuum)

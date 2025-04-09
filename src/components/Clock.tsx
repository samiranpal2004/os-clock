"use client"

import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import { Switch } from "../components/ui/Switch"
import { Checkbox } from "../components/ui/Checkbox"
import { cn } from "../lib/utils"

interface ClockSettings {
  isAnalog: boolean
  showDate: boolean
  showDay: boolean
  is24Hour: boolean
  showAmPm: boolean
  showSeconds: boolean
  showHours: boolean
  isDarkMode: boolean
}

export default function Clock() {
  const [time, setTime] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<ClockSettings>({
    isAnalog: false,
    showDate: true,
    showDay: true,
    is24Hour: false,
    showAmPm: false,
    showSeconds: true,
    showHours: true,
    isDarkMode: false,
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("clockSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("clockSettings", JSON.stringify(settings))

    // For Chrome extension storage (commented out for now)
    // if (chrome?.storage?.sync) {
    //   chrome.storage.sync.set({ clockSettings: settings })
    // }
  }, [settings])

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time based on settings
  const formatTime = () => {
    let hours = time.getHours()
    const minutes = time.getMinutes().toString().padStart(2, "0")
    const seconds = time.getSeconds().toString().padStart(2, "0")

    let ampm = ""
    if (!settings.is24Hour) {
      ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12 || 12
    }

    hours = hours.toString().padStart(2, "0")

    let timeString = `${hours}:${minutes}`

    if (settings.showSeconds) {
      timeString += `:${seconds}`
    }

    if (settings.showAmPm && !settings.is24Hour) {
      timeString += ` ${ampm}`
    }

    return timeString
  }

  // Format date based on settings
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {}

    if (settings.showDay) {
      options.weekday = "long"
    }

    if (settings.showDate) {
      options.month = "short"
      options.day = "numeric"
    }

    return time.toLocaleDateString("en-US", options)
  }

  // Toggle a setting
  const toggleSetting = (setting: keyof ClockSettings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <div
      className={cn(
        "w-full max-w-xs mx-auto p-6 rounded-lg text-white text-center transition-all",
        "bg-gradient-to-b from-rose-300/80 to-teal-700/80",
        settings.isDarkMode && "from-slate-800 to-slate-950",
      )}
    >
      {settings.isAnalog ? (
        <div className="mb-4">
          <AnalogClock time={time} showHours={settings.showHours} />
        </div>
      ) : (
        <div className="text-5xl font-bold mb-2">{formatTime()}</div>
      )}

      {(settings.showDate || settings.showDay) && <div className="text-xl mb-4">{formatDate()}</div>}

      <div className="flex items-center justify-center mb-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-white/90 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span>Clock options</span>
        </button>
      </div>

      {showSettings && (
        <div className="text-left space-y-2">
          <SettingItem
            label="Analog clock"
            checked={settings.isAnalog}
            onChange={() => toggleSetting("isAnalog")}
            type="switch"
          />

          {settings.isAnalog && (
            <SettingItem
              label="Show hours"
              checked={settings.showHours}
              onChange={() => toggleSetting("showHours")}
              type="switch"
            />
          )}

          {!settings.isAnalog && (
            <>
              <SettingItem
                label="24 hours"
                checked={settings.is24Hour}
                onChange={() => toggleSetting("is24Hour")}
                type="switch"
              />

              {!settings.is24Hour && (
                <SettingItem
                  label="AM/PM"
                  checked={settings.showAmPm}
                  onChange={() => toggleSetting("showAmPm")}
                  type="switch"
                />
              )}

              <SettingItem
                label="Seconds"
                checked={settings.showSeconds}
                onChange={() => toggleSetting("showSeconds")}
                type="switch"
              />
            </>
          )}

          <SettingItem
            label="Show date"
            checked={settings.showDate}
            onChange={() => toggleSetting("showDate")}
            type="checkbox"
          />

          <SettingItem
            label="Show day"
            checked={settings.showDay}
            onChange={() => toggleSetting("showDay")}
            type="checkbox"
          />

          <SettingItem
            label="Dark mode"
            checked={settings.isDarkMode}
            onChange={() => toggleSetting("isDarkMode")}
            type="switch"
          />
        </div>
      )}
    </div>
  )
}

// Analog Clock Component
function AnalogClock({ time, showHours = true }: { time: Date; showHours?: boolean }) {
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const hourRotation = hours * 30 + minutes * 0.5
  const minuteRotation = minutes * 6
  const secondRotation = seconds * 6

  return (
    <div className="relative w-48 h-48 mx-auto">
      <div className="absolute inset-0 rounded-full border-2 border-white"></div>

      {/* Hour markers */}
      {showHours &&
        Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-white/70"
            style={{
              top: "4px",
              left: "calc(50% - 0.5px)",
              transformOrigin: "bottom center",
              transform: `rotate(${i * 30}deg) translateY(-22px)`,
            }}
          />
        ))}

      {/* Hour hand */}
      {showHours && (
        <div
          className="absolute top-1/2 left-1/2 w-1 h-16 bg-white rounded-full origin-bottom"
          style={{ transform: `translate(-50%, -100%) rotate(${hourRotation}deg)` }}
        />
      )}

      {/* Minute hand */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-20 bg-white rounded-full origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${minuteRotation}deg)` }}
      />

      {/* Second hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-white rounded-full origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${secondRotation}deg)` }}
      />

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  )
}

// Setting Item Component
function SettingItem({
  label,
  checked,
  onChange,
  type = "switch",
}: {
  label: string
  checked: boolean
  onChange: () => void
  type?: "switch" | "checkbox"
}) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      {type === "switch" ? (
        <Switch checked={checked} onCheckedChange={onChange} />
      ) : (
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-white data-[state=checked]:text-black border-white"
        />
      )}
    </div>
  )
}

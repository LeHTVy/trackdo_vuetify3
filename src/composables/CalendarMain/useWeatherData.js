import { onMounted, ref } from 'vue'

export function useWeatherData () {
  const weatherData = ref(null)
  const weatherLoading = ref(false)
  const weatherError = ref(null)

  // Weather API configuration - SA Centurion
  const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
  const DEFAULT_COORDINATES = {
    latitude: -25.85891,
    longitude: 28.18577,
  }
  const REFRESH_INTERVAL = 10 * 60 * 1000

  /**
   * Fetch weather data from API
   * @param {Object} coordinates
   */
  const fetchWeatherData = async (coordinates = DEFAULT_COORDINATES) => {
    weatherLoading.value = true
    weatherError.value = null

    try {
      const { latitude, longitude } = coordinates
      const url = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.current && data.current.temperature_2m !== undefined) {
        weatherData.value = {
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m,
          time: data.current.time,
          lastUpdated: new Date().toISOString(),
        }
      } else {
        throw new Error('Invalid weather data format')
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      weatherError.value = error.message
      weatherData.value = null
    } finally {
      weatherLoading.value = false
    }
  }

  /**
   * Get weather icon based on weather code
   * @param {number} weatherCode
   */
  const getWeatherIcon = weatherCode => {
    if (!weatherCode) return 'mdi-weather-partly-cloudy'

    // Weather code mapping (WMO codes)
    const iconMap = {
      0: 'mdi-weather-sunny', // Clear sky
      1: 'mdi-weather-partly-cloudy', // Mainly clear
      2: 'mdi-weather-partly-cloudy', // Partly cloudy
      3: 'mdi-weather-cloudy', // Overcast
      45: 'mdi-weather-fog', // Fog
      48: 'mdi-weather-fog', // Depositing rime fog
      51: 'mdi-weather-rainy', // Light drizzle
      53: 'mdi-weather-rainy', // Moderate drizzle
      55: 'mdi-weather-rainy', // Dense drizzle
      61: 'mdi-weather-rainy', // Slight rain
      63: 'mdi-weather-rainy', // Moderate rain
      65: 'mdi-weather-pouring', // Heavy rain
      71: 'mdi-weather-snowy', // Slight snow
      73: 'mdi-weather-snowy', // Moderate snow
      75: 'mdi-weather-snowy-heavy', // Heavy snow
      95: 'mdi-weather-lightning', // Thunderstorm
    }

    return iconMap[weatherCode] || 'mdi-weather-partly-cloudy'
  }

  /**
   * Get weather description based on weather code
   * @param {number} weatherCode
   */
  const getWeatherDescription = weatherCode => {
    if (!weatherCode) return 'Unknown'

    const descriptionMap = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm',
    }

    return descriptionMap[weatherCode] || 'Unknown'
  }

  const refreshWeather = () => {
    fetchWeatherData()
  }

  const setupAutoRefresh = () => {
    return setInterval(fetchWeatherData, REFRESH_INTERVAL)
  }

  onMounted(() => {
    fetchWeatherData()
  })

  return {
    // State
    weatherData,
    weatherLoading,
    weatherError,

    // Methods
    fetchWeatherData,
    refreshWeather,
    setupAutoRefresh,
    getWeatherIcon,
    getWeatherDescription,

    // Constants
    REFRESH_INTERVAL,
  }
}

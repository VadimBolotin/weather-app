import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IconType } from "../utilities/iconType";

export const getWeather = createAsyncThunk(
    'weather/getWeather',
    async (cityName) => {
        try{
            // Получать координаты города с помощью имени города
            let coordinates = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
            let { latitude, longitude} = coordinates.data.results[0];
            // Получаем именно данные о погоде
            let response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,cloud_cover&timezone=auto&forecast_days=1`)
            let { temperature_2m, rain, cloud_cover } = response.data.hourly;
            let temperature = [];
            const getIconType = (cloud_cover, rain) => {
                let iconType = '';
                iconType = 
                    (cloud_cover > 50) ? IconType.HEAVY_CLOUD :
                    (cloud_cover > 30) ? IconType.MODERATE_CLOUD : IconType.LIGHT_CLOUD;
                iconType = 
                    (rain > 7.6) ? IconType.HEAVY_RAIN :
                    (rain > 2.5) ? IconType.MODERATE_RAIN : 
                    (rain > 1) ? IconType.LIGHT_RAIN : iconType;

                return iconType;
            }

            // Данные о погоде в 6, 9, 12, 15, 18 часов
            // Дождь
            //     0 - 2.5 -> небольшой дождь
            //     2.5 - 7.6 -> умеренный дождь
            //     >7.6 -> ливень
            // Облака:
            //     0 - 30 -> легкая облачность
            //     30 - 50 -> умеренная облачность
            //     >50 -> тучи
            for ( let i = 6; i <= 18; i += 3){
                temperature.push({
                    id: cityName + i,
                    time: `${i}:00`,
                    temp: temperature_2m[i],
                    iconType: getIconType(cloud_cover[i], rain[i])
                })
            }
            // temperature.map(obj => console.log(obj) )
            return temperature;
        }  catch(e) {
            throw new Error('Проверьте правильность названия города.')
        }
    }
)

const weatherSlice = createSlice({
    name: 'weather', 
    initialState: {
        data: null, 
        isLoading: false,
        error: '',
    },
    extraReducers ( builder) {
        builder.addCase(getWeather.fulfilled, (state, action) => {
            // console.log('Завершение загрузки');
            state.isLoading = false,
            state.data = action.payload;
            state.error = '';
        });
        builder.addCase(getWeather.pending, (state, action) => {
            state.error = '';
            state.isLoading = true;
            // console.log('Начало загрузки');
        });
        builder.addCase(getWeather.rejected, (state, action) => {
            // console.log('Завершение загрузки');
            state.isLoading = false,
            // console.log(action.error.message);
            state.error = action.error.message;
        });
    }
});

export const weatherReducer = weatherSlice.reducer;
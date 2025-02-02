import { useRef } from 'react';
import { getWeather } from '../store/weatherSlice';
import { useDispatch } from 'react-redux';


function InputBlock () {
    let inputRef = useRef(null);
    const dispatch = useDispatch();

    const clickHandler = () => {
        dispatch(getWeather(inputRef.current.value));
    }

    const keyHandler = (event) => {
        if( event.key === 'Enter') {
            clickHandler();
            inputRef.current.focus();
        }
    }

    dispatch(getWeather('Moscow'));

    return (
        <div 
            className="flex justify-around rounded-lg shadow-xl p-5 bg-white/50"
            onKeyDownCapture={keyHandler}
        >
            <input
                className='capitalize outline-none text-xl w-3/4 bg-white/50 rounded-lg px-5 py-2'
                ref={inputRef} 
                placeholder='Название города'
                defaultValue="Moscow" 
                autoFocus
            />
            <button 
                className='bg-white/50 rounded-lg px-5 py-2 text-xl'
                onClick={clickHandler}
            >
                Нажми
            </button>
        </div>
    )
}

export default InputBlock;
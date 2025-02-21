import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./services/store.tsx";
import './../style.css';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}>
                <App/>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)

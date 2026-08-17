import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

export default defineNuxtPlugin(app => {
    const toast = useToast({
        position: 'top-right',
    });

    app.provide('toast', toast);
});
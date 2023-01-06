import axios from 'axios';
import Cookie from 'universal-cookie';

export async function speech_Token() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');

    if (speechToken !== undefined) {
        const index = speechToken.indexOf(':');
        return { authorizationkey: speechToken.slice(index + 1), region: speechToken.slice(0, index) };
    } else {
        try {
            const response = await axios.get('/api/get-speech-token');
            cookie.set('speech-token', response.data.region + ':' + response.data.token, {maxAge: 540, path: '/'});
          return { authorizationkey: response.data.token, region: response.data.region };
        } catch (err) {
            return { authorizationkey: null, error: err.response.data };
        }
    }
}
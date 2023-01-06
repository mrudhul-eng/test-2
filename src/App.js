import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import { speech_Token } from './speechToken';
import './custom.css'

const sdk = require('microsoft-cognitiveservices-speech-sdk')
export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logInfo: ''
        }
    }
    
    async componentDidMount() {
        const response_token = await speech_Token();
        if (response_token.authorizationkey === null) {
            this.setState({
                logInfo: 'ERROR: ' + response_token.error
            });
        }
    }
 recognizer;
    async inputMicrophone() {
        const response_token = await speech_Token();
        const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(response_token.authorizationkey, response_token.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
         this.recognizer = new sdk.SpeechRecognizer(speechConfig, sdk.AudioConfig.fromDefaultMicrophoneInput());

        this.setState({
            logInfo: ""
        });
        this.recognizer.startContinuousRecognitionAsync();
        this.recognizer.recognizing = (s, e) => {
            console.log(`RECOGNIZING: Text=${e.result.text}`);
           let logInfo = `${e.result.text}`;
            this.setState({
                        logInfo: logInfo
                     });
        };
        
        this.recognizer.recognized = (s, e) => {
            if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
                console.log(`RECOGNIZED: Text=${e.result.text}`);
                let logInfo = `${e.result.text}`;
                this.setState({
                    logInfo: logInfo
                 });
            }
            else if (e.result.reason == sdk.ResultReason.NoMatch) {
                console.log("NOMATCH: Speech could not be recognized.");
               let logInfo = 'Recognition Stopped.Please Tap microphone to Start Recognition';
                this.setState({
                    logInfo: logInfo
                 });
            }
        };
        
        this.recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);
        
            if (e.reason == sdk.CancellationReason.Error) {
                console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
                console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
                console.log("CANCELED: Did you set the speech resource key and region values?");
            }
        
            this.recognizer.stopContinuousRecognitionAsync();
        };
        
        this.recognizer.sessionStopped = (s, e) => {
            console.log("\n    Session stopped event.");
            this.recognizer.stopContinuousRecognitionAsync();
        };
    }

    render() {
        return (
            <Container className="app-container">
                <h2>Speech Recognition</h2>
                <div className="body">
                    <div className="col-6 textarea">
                        <code>{this.state.logInfo}</code>
                    </div>
                </div>
                <div className="mt-3">
                        <i className="fas fa-microphone fa-lg mr-2" onClick={() => this.inputMicrophone()}></i>
                        Tap to Speak From Your Microphone</div>
                        <div className="mt-3">
                        <i className="fas fa-stop fa-lg mr-2" onClick={() => this.recognizer.stopContinuousRecognitionAsync()}></i>
                        Stop Recognition</div>
                        <div className="mt-2"></div>
            </Container>
        );
    }
}
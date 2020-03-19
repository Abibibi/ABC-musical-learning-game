import './styles/css/reset.css';
import './styles/css/style.css';

import allSounds from './data/allSounds/allSounds.js';

const app = {
    init: () => {
        setTimeout(() => {
            // to make sure height taken into account
            // is always window height, even if 
            // viewport height is reduced (typically,
            // when the keyboard is displayed on mobile)
            const viewheight = window.innerHeight;
            const viewwidth = window.innerWidth;
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', `height=${viewheight}px, width=${viewwidth}px, initial-scale=1.0`);
        }, 300);
        
        app.container = document.getElementById('app');
        app.createVisualKeys();
        app.createAudioKeys();
        app.enablePlayingSound();
    },

    createVisualKeys: () => {
        app.keysVisual = document.createElement('div');   
        app.keysVisual.classList.add('keys');     

        for (let i=0; i<26; i++) {
            app.keyVisual = document.createElement('div');
            app.keyVisual.classList.add('key', `key-${i + 1}`);
            app.keyVisualKbd = document.createElement('kbd');
        
            // for each kbd text content to be a letter from the alphabet
            app.keyVisualKbd.textContent = String.fromCharCode(65 + i);
            
            app.keyVisual.appendChild(app.keyVisualKbd);
    
            // to get the UTF-16 code of each letter and make it the value of a data-key attribute
            app.keyVisual.setAttribute('data-key', app.keyVisual.textContent.charCodeAt(0));
            
            app.keyVisual.addEventListener('click', app.playSound);
           
            app.keysVisual.appendChild(app.keyVisual);
        };

        app.container.appendChild(app.keysVisual);
    },
    
    createAudioKeys: () => {
        allSounds.map(({ file, letter }) => {
            app.keyAudio = document.createElement('audio');
            app.keyAudio.setAttribute('data-key', letter.charCodeAt(0));
            app.keyAudio.setAttribute('crossorigin', 'anonymous');
            /* app.keyAudio.setAttribute('type', 'audio/mp3'); */
            app.keyAudio.setAttribute('src', file);
            
            app.container.appendChild(app.keyAudio);
        });
    },

    playSound: (event) => {
        // values depends on how letter was targeted (either pressed or clicked). Click can be done either on div or kbd element, hence the 2 last possibilities respectively.
        app.audio = document.querySelector(`audio[data-key="${event.keyCode}"]`) || document.querySelector(`audio[data-key="${event.target.dataset.key}"]`) || document.querySelector(`audio[data-key="${event.target.parentNode.dataset.key}"]`);

        if(!app.audio) return;

        app.audio.currentTime = 0;
        app.audio.play();

        // the playing style is applied to the div containing the letter when :

        // the matching key is pressed
        if (event.keyCode) {
            document.querySelector(`.key[data-key="${event.keyCode}"]`).classList.add('playing');

        // OR the div is clicked
        } else if (event.target.dataset.key) {
            event.target.classList.add('playing');

        // OR the kbd element (inside of the div) is clicked
        } else if (event.target.parentNode.dataset.key) {
            event.target.parentNode.classList.add('playing');
        }
    },

    removeTransition: (event) => {
        if (event.propertyName !== 'transform') {
            return;
        };

        event.target.classList.remove('playing');
    },

    enablePlayingSound: () => {
        app.visualKeys = document.querySelectorAll('.key');

        app.visualKeys.forEach(key => key.addEventListener('transitionend', app.removeTransition));

        window.addEventListener('keydown', app.playSound); 
    }
};

document.addEventListener('DOMContentLoaded', app.init);
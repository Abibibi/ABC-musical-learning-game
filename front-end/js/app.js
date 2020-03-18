const app = {
    init: () => {
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
            app.keyVisual.classList.add('key');
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
    
    createAudioKeys: async () => {
        // using server-supplied API to be able 
        // to access files from the sounds depository
        // on the front side
        app.audioFiles = await (await fetch('http://localhost:5000/sounds')).json();

        app.audioFiles.map((oneAudio) => {
            app.keyAudio = document.createElement('audio');
            app.keyAudio.setAttribute('data-key', oneAudio.charCodeAt(0));
            app.keyAudio.setAttribute('src', `../../data/sounds/${oneAudio}`);
            
            app.container.appendChild(app.keyAudio);
        });
    },

    playSound: (event) => {
        app.audio = document.querySelector(`audio[data-key="${event.keyCode}"]`) || document.querySelector(`audio[data-key="${event.target.dataset.key}"]`) || document.querySelector(`audio[data-key="${event.target.parentNode.dataset.key}"]`);

        if(!app.audio) return;
        console.log('playSound');
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
        console.log(event);
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
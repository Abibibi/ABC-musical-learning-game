const app = {
    init: () => {
        app.container = document.getElementById('app');
        app.createVisualKeys();
        app.createAudioKeys();
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
            app.audioKey = document.createElement('audio');
            app.audioKey.setAttribute('data-key', oneAudio.charCodeAt(0));
            app.audioKey.setAttribute('src', `../../data/sounds/${oneAudio}`);
            
            app.container.appendChild(app.audioKey);
        });
    }
};

document.addEventListener('DOMContentLoaded', app.init);
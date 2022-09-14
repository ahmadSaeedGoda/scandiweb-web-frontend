export const useKeyBoardFormManipulator = ({ keyboardKeysScheme }) => {

    const registeredListeners = [];
    
    const controller = new AbortController();

    const registerListeners = () => {
        for (const keyboardKey in keyboardKeysScheme) {
            if (Object.hasOwnProperty.call(keyboardKeysScheme, keyboardKey)) {
                const listener = event => {
                    if (event.code === `${keyboardKey}`) {
                        event.preventDefault();

                        document.getElementById(keyboardKeysScheme[keyboardKey]['handlerID']).click()
                    }
                };

                document.addEventListener("keydown", listener, { signal: controller.signal } );

                // important to keep a reference for each registered listener to be able to remove them when not anymore needed
                registeredListeners.push(listener);
            }
        }
    };

    // We need to allow the developer/userOfthisFunc remove listeners when needed to avoid memory leaks
    const removeListeners = () => registeredListeners.forEach( () => controller.abort() );

    return {
        registerListeners: registerListeners,
        removeListeners: removeListeners
    };
};

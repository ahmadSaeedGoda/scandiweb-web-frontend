export const useKeyBoardFormManipulator = ({ keyboardKeysScheme }) => {

    const registeredListeners = [];

    const registerListeners = () => {
        for (const keyboardKey in keyboardKeysScheme) {
            if (Object.hasOwnProperty.call(keyboardKeysScheme, keyboardKey)) {
                const listener = event => {
                    if (event.code === `${keyboardKey}`) {
                        event.preventDefault();

                        document.getElementById(keyboardKeysScheme[keyboardKey]['handlerID']).click()
                    }
                };

                document.addEventListener("keydown", listener);

                // important to keep a reference for each registered listener to be able to remove them when not anymore needed
                registeredListeners.push(listener);
            }
        }
    };

    // We need to allow the developer/userOfthisFunc remove listeners when needed to avoid memory leaks
    const removeListeners = () => {
        for (const listener of registeredListeners) {
            if (Object.hasOwnProperty.call(registeredListeners, listener)) {
                console.log('listener= ', listener);
                return document.removeEventListener("keydown", listener);
            }
        }
    };

    return {
        registerListeners: registerListeners,
        removeListeners: removeListeners
    };
};

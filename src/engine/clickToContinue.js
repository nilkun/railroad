export default function ClickToContinue(func) {
    const doStuff = (e) => {
        window.removeEventListener('keydown', e => doStuff(e));
        func(e);
    }
    window.addEventListener("keydown", e => doStuff(e));
}
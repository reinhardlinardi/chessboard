let trayCounter = 0;

export default {
    data: {
        // TODO: Do not hardcode
        board: [
            "rnbqkbnr".split(""),
            "pppppppp".split(""),
            "........".split(""),
            "........".split(""),
            "........".split(""),
            "........".split(""),
            "PPPPPPPP".split(""),
            "RNBQKBNR".split(""),
        ],
    },
    methods: {
        util: {
            toRank(inverseRank) { return 7-inverseRank; },
            isPiece(piece) { return piece !== "." },
            isDarkSquared(rank, file) {
                return (rank + file) % 2 === 0? true : false;
            },
        },
        handler: {
            onDragStart(ev) {
                // Save dragged item id
                ev.dataTransfer.setData("text/plain", ev.target.id);
                // Allow copy or move data
                ev.dataTransfer.effectAllowed = "copyMove";
            },
            onDropReplaceOrCopy(ev) {
                // Get dragged item id
                const id = ev.dataTransfer.getData("text/plain");

                // Prevent drag and drop to self to supress errors
                if (id === ev.target.id) {
                    return;
                }

                let el = document.getElementById(id);

                // TODO: Validate position?

                // If source is tray, create a copy
                if(id.includes("tray")) {
                    let copy = el.cloneNode(true);
                    
                    // Set new unique id
                    trayCounter++;
                    copy.id = `piece-${trayCounter}`;
                    el = document.getElementById(copy.id);
                }

                // Move item, copy image and id from dragged item
                ev.target.appendChild(el);
                ev.target.src = el.src;
                
            },
            onDropRemove(ev) {
                // Get dragged item id
                const id = ev.dataTransfer.getData("text/plain");

                // Prevent removing items from tray
                if(id.includes("tray")) {
                    return;
                }

                // TODO: Validate position?

                let el = document.getElementById(id);
                el.parentNode.removeChild(el);
            },
        },
    },
};
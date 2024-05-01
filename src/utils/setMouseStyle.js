const setMouseStyle = () => {
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;
    if(document.getElementById('cursor-mouse')) return;

    let cursor = document.createElement("div");
        cursor.id = "cursor-mouse";
        cursor.delayTime = 0;
        cursor.moveTrigger = false;
        cursor.content = '';
        cursor.excludedTags = /^(head|meta|link|title|option|script|noscript|style)$/i;
    document.body.appendChild(cursor);

    // Move
    const mousemove = (e) => {

        let px = e.clientX;
        let py = e.clientY;

        requestAnimationFrame(() => {
            cursor.style.cssText = `
            transition: transform ${cursor.delayTime}s ease-out, width 0.5s, height 0.5s, opacity 0.5s, background-color 0.5s;
            transform: translate3d(${px}px, ${py}px, 0) translate(-50%, -50%);
        `;

            if (!cursor.moveTrigger) {
                cursor.moveTrigger = true;
                cursor.delayTime = 0.2;
                cursor.classList.add("init");
            }
        });
    }

    // Enter
    const mouseenter = (e) => {
        let content = e.target.getAttribute('data-cursor');
        cursor.classList.add("active");
        cursor.content = content ? `"${content}"` : '"CLICK"';
        document.body.style.setProperty('--before-content', content ? `"${content}"` : '"CLICK"');
    }

    // Leave
    const mouseleave = () => {
        cursor.classList.remove("active");
        cursor.content = '';
        document.body.style.setProperty('--before-content', '');
    }

    window.addEventListener("mousemove", mousemove);

    const targetEvent = (element, method) => {
        element[`${method}EventListener`]("mouseenter", mouseenter);
        element[`${method}EventListener`]("mouseleave", mouseleave);
    }

    document.querySelectorAll("a, button").forEach((element) => {
        targetEvent(element, "add");
    })

    // Observe Element
    cursor.observeGroup = [];
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                // check new element added?
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE && !cursor.excludedTags.test(addedNode.tagName)) {
                        
                        if (['A', 'BUTTON'].includes(addedNode.tagName)) {
                            targetEvent(addedNode, "add");
                            // cursor.observeGroup.push(addedNode)
                        }

                        addedNode.querySelectorAll("a, button").forEach((childNode) => {
                            targetEvent(childNode, "add");
                            // cursor.observeGroup.push(childNode)
                        })
                    }
                }
            }
        });
    });

    // Observe Start
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
        // document.body.removeChild(cursor);
        // window.removeEventListener("mousemove", mousemove);
        // document.querySelectorAll("a, button").forEach((element) => {
        //     targetEvent(element, "remove");
        // });
        // cursor.observeGroup.forEach((element) => {
        //     targetEvent(element, "remove");
        // })
        // observer.disconnect();

    }
}

export default setMouseStyle;

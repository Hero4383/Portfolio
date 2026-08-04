(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  if (header) {
    let headerFrame = 0;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
      headerFrame = 0;
    };

    updateHeader();
    window.addEventListener(
      "scroll",
      () => {
        if (!headerFrame) {
          headerFrame = window.requestAnimationFrame(updateHeader);
        }
      },
      { passive: true },
    );
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reducedMotion && finePointer) {
    let pointerFrame = 0;
    let pointerX = 50;
    let pointerY = 25;

    document.addEventListener(
      "pointermove",
      (event) => {
        pointerX = (event.clientX / window.innerWidth) * 100;
        pointerY = (event.clientY / window.innerHeight) * 100;

        if (!pointerFrame) {
          pointerFrame = window.requestAnimationFrame(() => {
            root.style.setProperty("--pointer-x", `${pointerX.toFixed(2)}%`);
            root.style.setProperty("--pointer-y", `${pointerY.toFixed(2)}%`);
            pointerFrame = 0;
          });
        }
      },
      { passive: true },
    );
  }
})();

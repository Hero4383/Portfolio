(() => {
  "use strict";

  const emailAddress = "ittnathanstorms@gmail.com";
  const contractInput = document.getElementById("contractId");
  const templateElement = document.getElementById("requestTemplate");
  const copyEmailButton = document.getElementById("copyEmailBtn");
  const copyTemplateButton = document.getElementById("copyTemplateBtn");
  const copyCryptoButton = document.getElementById("copyCryptoBtn");
  const emailRequestButton = document.getElementById("emailRequestBtn");
  const statusElement = document.getElementById("copyStatus");

  const cryptoAddresses = [
    { label: "BTC (Bitcoin)", id: "addr-btc" },
    { label: "ETH (Ethereum)", id: "addr-eth" },
    { label: "USDC (Ethereum)", id: "addr-usdc-eth" },
    { label: "SOL (Solana)", id: "addr-sol" },
    { label: "USDC (Solana)", id: "addr-usdc-sol" },
    { label: "XRP (XRP Ledger)", id: "addr-xrp" }
  ];

  let statusTimer;

  function buildTemplate() {
    if (!contractInput || !templateElement) {
      return;
    }

    const contractId = contractInput.value.trim() || "[CONTRACT_ID]";
    templateElement.value = `Subject: Bank Transfer Request - ${contractId}\n\n` +
      "Hello Nathan,\n\n" +
      "I would like to pay via bank transfer for contracted work.\n\n" +
      `Contract ID: ${contractId}\n` +
      "Payer name: \n" +
      "Company (if applicable): \n" +
      "Amount (USD): \n" +
      "Preferred method: ACH / Zelle / USDC\n" +
      "Zelle sender email/phone (if Zelle): \n" +
      "Crypto network + sender wallet (if USDC): \n\n" +
      "Please send the bank transfer details.\n\n" +
      "Thank you,";

    updateEmailLink();
  }

  function updateEmailLink() {
    if (!emailRequestButton || !templateElement) {
      return;
    }

    const message = templateElement.value;
    const divider = message.indexOf("\n\n");
    const subject = divider >= 0 ? message.slice(9, divider) : "Bank Transfer Request";
    const body = divider >= 0 ? message.slice(divider + 2) : message;
    emailRequestButton.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function showStatus(message, isError = false) {
    if (!statusElement) {
      return;
    }

    window.clearTimeout(statusTimer);
    statusElement.textContent = message;
    statusElement.classList.toggle("is-error", isError);
    statusElement.classList.add("is-visible");
    statusTimer = window.setTimeout(() => {
      statusElement.classList.remove("is-visible", "is-error");
    }, 2800);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.appendChild(temporary);
    temporary.select();

    const copied = document.execCommand("copy");
    temporary.remove();

    if (!copied) {
      throw new Error("Clipboard copy was not available.");
    }
  }

  async function copyWithStatus(text, label) {
    try {
      await copyText(text);
      showStatus(`${label} copied.`);
    } catch {
      showStatus(`Could not copy ${label.toLowerCase()}. Select it manually instead.`, true);
    }
  }

  if (contractInput) {
    contractInput.addEventListener("input", buildTemplate);
  }

  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", () => {
      copyWithStatus(emailAddress, "Email address");
    });
  }

  if (copyTemplateButton && templateElement) {
    copyTemplateButton.addEventListener("click", () => {
      copyWithStatus(templateElement.value, "Request template");
    });
  }

  if (copyCryptoButton) {
    copyCryptoButton.addEventListener("click", () => {
      const lines = cryptoAddresses.map((entry) => {
        const element = document.getElementById(entry.id);
        const address = element ? element.textContent.trim() : "";
        return `${entry.label}: ${address}`;
      });

      copyWithStatus(lines.join("\n"), "Crypto addresses");
    });
  }

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-copy-target");
      const target = targetId ? document.getElementById(targetId) : null;
      const label = button.getAttribute("data-copy-label") || "Value";

      if (!target) {
        showStatus("That payment destination could not be found.", true);
        return;
      }

      copyWithStatus(target.textContent.trim(), label);
    });
  });

  buildTemplate();
})();

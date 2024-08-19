import Widget from "./Widget";

export default class CardWidget {
  constructor(parentNode) {
    const widgetTemplate = document.createElement("form");

    widgetTemplate.classList.add("card-validator");
    widgetTemplate.insertAdjacentHTML(
      "beforeend",
      `<div class="card-validator__pay-type"></div>
            <div class="card-validator__form-body">
            <input type="text" data-type="card-number" data-card-is-valid="">
            <button type="submit">Validate number</button>
        </div>`,
    );
    this.inputWidget = new Widget(widgetTemplate, parentNode);
    this.paySystems = [
      { title: "maestro", pattern: /^(5[0678]|6304|6390|6054|6271|67)\d*$/ },
      {
        title: "master-card",
        pattern: /^(5[1-5]|222[1-9]|2[3-6]|27[0-1]|2720)\d*$/,
      },
      { title: "mir", pattern: /^22\d*$/ },
      { title: "visa", pattern: /^4\d*$/ },
    ];
    this.parentNode = parentNode;
    this.timeoutId = false;

    //#TODO: form render
    this.inputWidget.initWidget(parentNode);
    for (const paySystem of this.paySystems) {
      widgetTemplate
        .querySelector(".card-validator__pay-type")
        .insertAdjacentHTML(
          "beforeend",
          this._createPaySystemIco(paySystem.title),
        );
    }

    //#TODO: events
    this.inputWidget.addListener(
      "input",
      "input[data-type='card-number']",
      this.checkCardType.bind(this),
    );
    this.inputWidget.addListener(
      "submit",
      "form.card-validator",
      this.checkValidateCard.bind(this),
    );
  }

  checkCardType(event) {
    const cardNumber = event.currentTarget.value;
    const paySystem =
      this.paySystems.find((paySystem) => paySystem.pattern.test(cardNumber)) ??
      false;

    Array.from(
      this.parentNode.querySelectorAll(".card-validator__pay-type-item.active"),
    ).forEach((item) => item.classList.remove("active"));

    if (paySystem) {
      this.parentNode
        .querySelector(
          `.card-validator__pay-type-item[data-type-card="${paySystem.title}"]`,
        )
        .classList.add("active");
    }
  }

  checkValidateCard(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector(
      "input[data-type='card-number']",
    );
    const cardNumber = input.value;
    const isValid = this._validateCardNumber(cardNumber);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    input.dataset.cardIsValid = isValid ? "yes" : "no";
    this.timeoutId = setTimeout(() => (input.dataset.cardIsValid = ""), 5000);
  }

  _validateCardNumber(cardNumber) {
    //only digits and spaces
    if (cardNumber.match(/[^\d\s]/) != null) {
      return false;
    }

    const digits = cardNumber
      .toString()
      .replace(/\D/g, "")
      .split("")
      .map(Number);
    let sum = 0;
    let isSecond = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isSecond) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isSecond = !isSecond;
    }

    return sum % 10 === 0;
  }

  _createPaySystemIco(paymentName) {
    return `<div class="card-validator__pay-type-item ${paymentName}" data-type-card="${paymentName}"></div>`;
  }
}

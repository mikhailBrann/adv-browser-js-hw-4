import CardWidget from "../CardWidget";

import { JSDOM } from "jsdom";
import { test, expect, describe, beforeEach } from "@jest/globals";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;

describe("CardWidget", () => {
  let cardWidget;

  beforeEach(() => {
    cardWidget = new CardWidget(global.document.body);
  });

  describe("_validateCardNumber", () => {
    test("valid card numbers", () => {
      /*
        maestro 586824160825533338
        master-card 5555555555554444
        mir 2201382000000013
        visa 4012888888881881
        */
      expect(cardWidget._validateCardNumber("586824160825533338")).toEqual(
        true,
      );
      expect(cardWidget._validateCardNumber("5555555555554444")).toEqual(true);
      expect(cardWidget._validateCardNumber("2201382000000013")).toEqual(true);
      expect(cardWidget._validateCardNumber("4012888888881881")).toEqual(true);
    });

    test("no valid card numbers", () => {
      expect(cardWidget._validateCardNumber("4111111111111112")).toEqual(false);
      expect(cardWidget._validateCardNumber("1234567890123456")).toEqual(false);
    });

    test("should handle card numbers with spaces and letters", () => {
      expect(cardWidget._validateCardNumber("4111 1111 1111 1111")).toEqual(
        true,
      );
      expect(cardWidget._validateCardNumber("5500 0000 0000 0004")).toEqual(
        true,
      );
      expect(cardWidget._validateCardNumber("5500 0000 adsa 0004")).toEqual(
        false,
      );
      expect(cardWidget._validateCardNumber("5500 %!@%! 0000 0004")).toEqual(
        false,
      );
    });
  });
});

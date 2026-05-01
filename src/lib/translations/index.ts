import { common } from "./common";
import { nav } from "./nav";
import { footer } from "./footer";
import { home } from "./home";
import { shop } from "./shop";
import { cart } from "./cart";
import { blog } from "./blog";
import { product } from "./product";
import { orders } from "./orders";
import { deposit } from "./deposit";
import { chat } from "./chat";
import { auth } from "./auth";
import { settings } from "./settings";

export const translations = {
  vi: {
    common: common.vi,
    nav: nav.vi,
    bottom_nav: nav.vi.bottom,
    footer: footer.vi,
    home: home.vi,
    shop: shop.vi,
    cart: cart.vi,
    blog: blog.vi,
    product: product.vi,
    orders: orders.vi,
    deposit: deposit.vi,
    chat: chat.vi,
    auth: auth.vi,
    settings: settings.vi,
  },
  en: {
    common: common.en,
    nav: nav.en,
    bottom_nav: nav.en.bottom,
    footer: footer.en,
    home: home.en,
    shop: shop.en,
    cart: cart.en,
    blog: blog.en,
    product: product.en,
    orders: orders.en,
    deposit: deposit.en,
    chat: chat.en,
    auth: auth.en,
    settings: settings.en,
  },
};

export type Language = "vi" | "en";
export type TranslationKey = typeof translations.vi;

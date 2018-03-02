import { defineLocale, LocaleData } from 'ngx-bootstrap/chronos';
import {
  arLocale, csLocale, daLocale, deLocale, enGbLocale, esDoLocale, esLocale, esUsLocale, frLocale, heLocale, hiLocale,
  huLocale, itLocale, jaLocale, koLocale, nlBeLocale, nlLocale, plLocale, ptBrLocale, ruLocale, svLocale,
  thLocale, trLocale, zhCnLocale
} from 'ngx-bootstrap/locale';

const locales = [
  arLocale, csLocale, daLocale, deLocale, enGbLocale, esLocale, esDoLocale, esUsLocale,
  frLocale, hiLocale, heLocale, huLocale, itLocale, jaLocale, koLocale, nlLocale,
  nlBeLocale, plLocale, ptBrLocale, svLocale, ruLocale, zhCnLocale, trLocale, thLocale
];

export function loadLocales () {
  locales.forEach((locale: LocaleData) => defineLocale(locale.abbr, locale));
}

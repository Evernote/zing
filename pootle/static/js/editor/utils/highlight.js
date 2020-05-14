/*
 * Copyright (C) Pootle contributors.
 * Copyright (C) Zing contributors.
 *
 * This file is a part of the Zing project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import { BASE_MAP_REVERSE_HL, RE_BASE_REVERSE } from './font';
import { escapeRegexReplacementSymbols } from './search';

/* eslint-disable no-irregular-whitespace */
const PUNCTUATION_RE = /[™©®]|[℃℉°]|[±πθ×÷−√∞∆Σ′″]|[‘’ʼ‚‛“”„‟]|[«»]|[£¥€]|…|—|–|[ ]/g;
/* eslint-enable no-irregular-whitespace */
// Marks + Degree-related + Maths + Quote characters + Guillemets + Currencies +
// U2026 horizontal ellipsis + U2014 em dash + U2013 en dash +
// U202F narrow no-break space

export function highlightPunctuation(text, className = '') {
  function replace(match) {
    return `<span class="highlight-punctuation ${className}">${match}</span>`;
  }

  return text.replace(PUNCTUATION_RE, replace);
}

const ESCAPE_RE = /\\r|\\n|\\t/gm;

export function highlightEscapes(text, className = '') {
  const escapeHl = `<span class="highlight-escape ${className}">%s</span>`;
  function replace(match) {
    const submap = {
      '\\r': escapeHl.replace(/%s/, '\\r'),
      '\\n': escapeHl.replace(/%s/, '\\n'),
      '\\t': escapeHl.replace(/%s/, '\\t'),
    };

    return submap[match];
  }

  return text.replace(ESCAPE_RE, replace);
}

const NL_RE = /\r\n|[\r\n]/gm;

export function nl2br(text) {
  return text.replace(NL_RE, '$&<br/>');
}

const HTML_RE = /<[^>]+>|[&<>]/gm;

export function highlightHtml(text, className = '') {
  const htmlHl = `<span class="highlight-html ${className}">&lt;%s&gt;</span>`;
  function replace(match) {
    const submap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };

    let replaced = submap[match];

    if (replaced === undefined) {
      const remainder = match.slice(1, match.length - 1);
      replaced = htmlHl.replace(
        /%s/,
        escapeRegexReplacementSymbols(highlightHtml(remainder))
      );
    }

    return replaced;
  }

  return text.replace(HTML_RE, replace);
}

export function highlightSymbols(text, className = '') {
  function replace(match) {
    const charCode = BASE_MAP_REVERSE_HL[match].charCodeAt().toString(16);
    const zeros = '0'.repeat(4 - charCode.length);
    const codePoint = `\\u${zeros}${charCode.toUpperCase()}`;
    return `<span class="${className}" data-codepoint="${codePoint}">${match}</span>`;
  }

  return text.replace(RE_BASE_REVERSE, replace);
}

// eslint-disable-next-line max-len
// U+1F680 to U+1F6FF
const emojiRegex =
  '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])';

export function highlightEmojis(textInput) {
  let stringOuput = '';

  if (textInput.match(emojiRegex)) {
    const listOfTokens = textInput.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    const openTag = '<span class="highlight-html js-editor-copytext">';
    const closeTag = '</span>';

    for (let i = 0; i < listOfTokens.length; i++) {
      if (listOfTokens[i].match(emojiRegex)) {
        stringOuput += openTag + listOfTokens[i] + closeTag;
      } else {
        stringOuput += listOfTokens[i];
      }
    }
  } else {
    stringOuput = textInput;
  }
  return stringOuput;
}

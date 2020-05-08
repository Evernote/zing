/*
 * Copyright (C) Zing contributors.
 *
 * This file is a part of the Zing project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

export const Formats = {
  TEXT: 'TEXT',
  PLURR: 'PLURR',
};

export function detectFormat(value) {
  if (value.search(/{[^{}]*:.*?}/) !== -1) {
    return Formats.PLURR;
  } else if (value.search(/{[^ ]*}/) !== -1) {
    return Formats.PLURR;
  }

  return Formats.TEXT;
}

import React from 'react'

export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }
  
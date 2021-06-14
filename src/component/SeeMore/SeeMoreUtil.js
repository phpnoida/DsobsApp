import {PixelRatio} from 'react-native';
import reactNativeTextSize from 'react-native-text-size';
import {scale} from '../../theme/Scalling';

/**
 * When difference between partialTextWidth and widthLimit is less than
 * this value, we mark the truncation index.
 */
const DIFFERENCE_THRESHOLD = 10;

/**
 * Finds the point where the text will be truncated, leaving enough space to show
 * the "read more" link
 *
 * @param text {string} Text for which you need to find the truncation index
 * @param numberOfLines {number} Number of lines being displayed
 * @param fontSize {number} Font size
 * @param fontFamily {string} Font family
 * @param fontWeight {string} Font weight
 * @param containerWidth {number} Width of the container in which the text will be contained
 * @param seeMoreText {string} See more text
 */

function _getFontSize(length) {
  if (length < 100) {
    return scale(23);
  } else if (length > 100 && length < 600) {
    return scale(20);
  } else if (length > 600 && length < 1000) {
    return scale(17);
  } else {
    return scale(15);
  }
}

async function getTruncationIndex(
  text,
  numberOfLines,
  fontSize,
  fontFamily,
  fontWeight,
  containerWidth,
  seeMoreText,
) {
  //const scaledFontSize = Math.round(fontSize * PixelRatio.getFontScale());
  const scaledFontSize = fontSize;

  const {width: totalTextWidth} = await reactNativeTextSize.measure({
    text,
    fontSize: scaledFontSize,
    fontFamily,
    fontWeight,
  });

  /**
   * Max possible width of the text when it is collapsed.
   * 10 is approx value of white space width per line.
   */
  const widthLimit = (containerWidth - 10) * numberOfLines;

  if (totalTextWidth < widthLimit) {
    return undefined;
  }

  let index = 0;
  let start = 0;
  let end = text.length - 1;

  while (start <= end) {
    const middle = start + (end - start) / 2;
    // eslint-disable-next-line no-await-in-loop
    const {width: partialTextWidth} = await reactNativeTextSize.measure({
      text: text.slice(0, middle),
      fontSize: scaledFontSize,
      fontFamily,
      fontWeight,
    });
    if (Math.abs(widthLimit - partialTextWidth) <= DIFFERENCE_THRESHOLD) {
      index = middle;
      break;
    } else if (partialTextWidth > widthLimit) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }

  let truncationIndex = Math.floor(index) - (seeMoreText.length + 10);

  // If there is a new line character before this truncation index, this will break
  // So we find the first new line character before truncationIndex and set that as the
  // new truncation index
  const newLineCharacterIndex = text.slice(0, truncationIndex).indexOf('\n');
  if (newLineCharacterIndex > -1) {
    truncationIndex = newLineCharacterIndex;
  }

  return truncationIndex;
}

export default {
  getTruncationIndex,
};

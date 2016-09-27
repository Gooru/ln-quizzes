/*jshint multistr: true */
import Ember from 'ember';
import { GRADING_SCALE } from 'gooru-web/config/config';

/**
 * Generate the legend to show the grading scale used throughout the app
 * Additional options may be displayed with the grading scale
 *
 * @example
 *
 * {{grading-scale-legend}}
 * {{grading-scale-legend notStarted="not started"}}
 *
 * @param hash {String} - Object with named arguments:
 *   * notStarted {String} - string for the legend option 'not started'
 * @returns {String}
 */
export function gradingScaleLegend(params, hash) {

  const notStarted = hash && hash.notStarted;

  const $el = $('<div><ul class="grading-scale-legend"></ul></div>');
  const $legend = $el.find('.grading-scale-legend');

  var gradingScaleLen = GRADING_SCALE.length;

  if (notStarted) {
    $legend.append('<li class="not-started"> \
                      <i></i> \
                      <span>' + notStarted + '</span>\
                   </li>');
  }

  for (let i = 0; i < gradingScaleLen; i++) {
    let bracket = GRADING_SCALE[i];

    // The upper limit of the grading scale will be 100
    let upperLimit = GRADING_SCALE[i + 1] ? GRADING_SCALE[i + 1].LOWER_LIMIT - 1 : 100;

    $legend.append('<li> \
                      <i style="background-color: ' + bracket.COLOR + ';"></i> \
                      <span>' + bracket.LOWER_LIMIT + ' - ' + upperLimit + '%</span>\
                   </li>');
  }

  return new Ember.Handlebars.SafeString($el.html());
}

export default Ember.Helper.helper(gradingScaleLegend);

import Ember from 'ember';
/**
 * Model for context inside collection play resource event.
 *
 * @typedef {Object} Context
 *
 */
export default Ember.Object.extend({

  /**
   * @property {string} collectionId - Playing collection / assessment UUID
   */
  collectionId: null,

  /**
   * @property {string} parentGooruId - This event should be collection.play eventId for analytics to associate this event with collection.
   */
  parentEventId: null,

  /**
   * @property {string} sessionId - Session id for the assessment
   */
  sessionId: null,

  /**
   * @property {string} resourceEventId - Unique Id should be generated for every event from FE. This eventId should be same for start and stop event
   */
  resourceEventId: null,

  /**
   * @property {string} classId - Class unique Id associated for the collection / assessment.
   * Can be null if play is outside context of class.
   */
  classId: null,

  /**
   * @property {string} eventType - Values are : start / stop
   * If resource started to play then start, Reached end page or summary page or moved to next resource  then stop
   */
  eventType: null,

  /**
   * @property {string} courseId - Unique of course associated to the class. Can be null if play is outside context of class.
   */
  courseId: null,

  /**
   * @property {string} unitId - Unit unique Id. Can be null if play is outside context of class.
   */
  unitId: null,

  /**
   * @property {string} lessonId - Lesson unique Id. Can be null if play is outside context of class.
   */
  lessonId: null,

  /**
   * @property {string} collectionType - Type of collection/assessment: collection or assessment
   */
  collectionType: null,

  /**
   * @property {string} clientSource - Get Collection/Assessment API will return how many questions available inside assessments.
   */
  clientSource: 0,

  /**
   * Indicates if the event type is stop
   * @property {boolean}
   */
  isStopEvent: Ember.computed.equal("eventType", "stop"),

  /**
   * Indicates if the event type is start
   * @property {boolean}
   */
  isStartEvent: Ember.computed.equal("eventType", "start"),

  /**
   * @property  {boolean}
   */
  isInContext: Ember.computed.bool("lessonId")

});


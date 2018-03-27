/**
 * 
 * @file logging.js
 * @namespace app 
 * @author Ross Newman <ross@rossnewman.com>
 */

 /**
  * This is the generic logging class
  */ 
class logging {
  /**
   * Lofgging constructor
   * @constructor
   * @param {object} res the HTTP response object for rendering the current page.
   */
    constructor(res) {
    this.res = res;
  }
   /**
   * The display function to show the head of the latest log messages
   * @param {integer} num - The number of messages to show
   */
    display(num) {
    this.res.write('\
    <div class="agenda">\n\
    <div class="table-responsive">\n\
        <table class="table table-condensed table-bordered">\n\
            <thead>\n\
                <tr>\n\
                    <th>Date</th>\n\
                    <th>Time</th>\n\
                    <th>Event</th>\n\
                </tr>\n\
            </thead>\n\
            <tbody>\n\
                <!-- Single event in a single day -->\n\
                <tr>\n\
                    <td class="agenda-date" class="active" rowspan="1">\n\
                        <div class="dayofmonth">26</div>\n\
                        <div class="dayofweek">Saturday</div>\n\
                        <div class="shortdate text-muted">July, 2014</div>\n\
                    </td>\n\
                    <td class="agenda-time">\n\
                        5:30 AM\n\
                    </td>\n\
                    <td class="agenda-events">\n\
                        <div class="agenda-event">\n\
                            <i class="glyphicon glyphicon-repeat text-muted" title="Repeating event"></i> \n\
                            Fishing\n\
                        </div>\n\
                    </td>\n\
                </tr>\n\
                \n\
                <!-- Multiple events in a single day (note the rowspan) -->\n\
                <tr>\n\
                    <td class="agenda-date" class="active" rowspan="3">\n\
                        <div class="dayofmonth">24</div>\n\
                        <div class="dayofweek">Thursday</div>\n\
                        <div class="shortdate text-muted">July, 2014</div>\n\
                    </td>\n\
                    <td class="agenda-time">\n\
                        8:00 - 9:00 AM \n\
                    </td>\n\
                    <td class="agenda-events">\n\
                        <div class="agenda-event">\n\
                            Doctors Appointment \n\
                        </div>\n\
                    </td>\n\
                </tr>\n\
                <tr>\n\
                    <td class="agenda-time">\n\
                        10:15 AM - 12:00 PM \n\
                    </td>\n\
                    <td class="agenda-events">\n\
                        <div class="agenda-event">\n\
                            Meeting with executives\n\
                        </div>\n\
                    </td>\n\
                </tr>\n\
                <tr>\n\
                    <td class="agenda-time">\n\
                        7:00 - 9:00 PM\n\
                    </td>\n\
                    <td class="agenda-events">\n\
                        <div class="agenda-event">\n\
                            Arias dance recital\n\
                        </div>\n\
                    </td>\n\
                </tr>\n\
            </tbody>\n\
        </table>\n\
    </div>\n\
</div>\n');
  }
};

module.exports = logging;
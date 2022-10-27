/**
 * SystemLogs schema, helpers & definitions
 *
 * https://www.indesigncolombia.com
 * https://www.meteor.com.co
 * @paulo.mogollon
 */

 import { Mongo } from 'meteor/mongo';


 const SystemLogs = new Mongo.Collection('systemLogs');
 
 export default SystemLogs;
 
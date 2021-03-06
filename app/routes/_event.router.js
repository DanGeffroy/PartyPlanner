// ```
// _event.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// _event.js may be freely distributed under the MIT license
// ```

// */app/routes/_event.router.js*

// ## Event API object

// HTTP Verb  Route                 Description

// GET        /api/event             Get all of the event items
// GET        /api/event/:event_id    Get a single event item by event item id
// POST       /api/event             Create a single event item
// DELETE     /api/event/:event_id    Delete a single event item
// PUT        /api/event/:event_id    Update a event item with new info

// Load the event model
import Event from '../models/event.model';

export default (app, router) => {

  // ### Event API Routes

  // Define routes for the event item API

  router.route('/event')

    // ### Create a event item

    // Accessed at POST http://localhost:8080/api/event

    // Create a event item
    .post((req, res) => {
      console.log(req.body);
      Event.create({

        title: req.body.title,
        password : req.body.password,
        date: req.body.date,
        place: req.body.place,
        tags: req.body.tags,
        description: req.body.description,
        shoppingList: req.body.shoppingList,
        attendees: req.body.attendees

      }, (err, event) => {

        if (err)
          res.send(err);

        // DEBUG
        console.log(`Event created: ${event}`);
        res.json(event);
      });
    })

    // ### Get all of the event items

    // Accessed at GET http://localhost:8080/api/event
    .get((req, res) => {

      // Use mongoose to get all event items in the database
      Event.find((err, event) => {

        if(err)
          res.send(err);

        else
          res.json(event);
      });
    });
    router.route('/event/:event_id/')

      .get((req, res) => {

        // Use mongoose to a single event item by id in the database
        Event.findOne({"_id" : req.params.event_id}, (err, event) => {

          if(err){
            res.send(err);
            event.password = "";
          }
          else
            res.json(event);
        });
      });
  router.route('/event/:event_id/:password')

    // ### Get a event item by ID

    // Accessed at GET http://localhost:8080/api/event/:event_id/:password
    .get((req, res) => {

      // Use mongoose to a single event item by id in the database
      Event.findOne({"_id" : req.params.event_id, "password": req.params.password}, (err, event) => {

        if(err)
          res.send(err);

        else
          res.json(event);
      });
    })

    // ### Update a event item by ID

    // Accessed at PUT http://localhost:8080/api/event/:event_id/:password
    .put((req, res) => {

      // use our event model to find the event item we want

      Event.findOne({

        '_id' : req.params.event_id,
        'password' : req.params.password

      }, (err, event) => {

        if (err)
          res.send(err);

        // Only update a field if a new value has been passed in
        if (req.body.title)
          event.title = req.body.title;

        if (req.body.date)
          event.date = req.body.date;

        if (req.body.place)
          event.place = req.body.place;

        if (req.body.tags)
          event.tags = req.body.tags;

        if (req.body.description)
          event.description = req.body.description;

        if (req.body.shoppingList)
          event.shoppingList = req.body.shoppingList;
        if (req.body.attendees)
          event.attendees = req.body.attendees;

        // save the event item
        return event.save((err) => {

          if (err)
            res.send(err);

          return res.send(event);

        });
      });
    })

    // ### Delete a event item by ID

    // Accessed at DELETE http://localhost:8080/api/event/:event_id
    .delete((req, res) => {

      // DEBUG
      console.log(`Attempting to delete event with id: ${req.params.event_id}`);

      Event.remove({

        _id : req.params.event_id,
        password : req.params.password
      }, (err, event) => {

        if(err)
          res.send(err);

        console.log('Event successfully deleted!');

        Event.find((err, events) => {
          if(err)
            res.send(err);

          res.json(events);
        });
      });
    });


    router.route('/addNewAttendee/:event_id')


      // ### add a new attendee to the event

      // Accessed at PUT http://localhost:8080/api/event/:event_id/newAttendee
      .put((req, res) => {

        // use our event model to find the event item we want
        Event.findOne({

          '_id' : req.params.event_id

        }, (err, event) => {
          if (err)
            res.send(err);
          if (req.body){
            event.attendees.push(req.body);


            // loop through all of the `newAttendees`
            for (let i = 0; i <  event.shoppingList.length; i++) {
              for (let w = 0; w <  req.body.shoppingList.length; w++) {
                // if both element are the same
                if (event.shoppingList[i]._id == req.body.shoppingList[w]._id) {
                  // increment the real qte
                  event.shoppingList[i].realqte += req.body.shoppingList[w].qte;
                }
              }
            }
          }
          // save the event item
          return event.save((err) => {
            if (err)
              res.send(err);
            else
              return res.send(event);

          });
        });
      });





};

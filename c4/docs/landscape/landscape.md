The Redmine Kanban project is an external tool to manage Redmine ticketing system. It enables better visualization of the tickets and their status. It is also possible to drag and drop tickets between different columns.

It consists of two parts:

* Redmine proxy: a small web application that is used to proxy the Redmine API and to add some caching functionality.
* Client: a web application that is used to display the tickets in a Kanban board.

The whole concept of the tools is trying to minimalize the changes that are needed to be done in the Redmine itself. The only thing that is needed is to add a custom ticket type (a tracker). The custom tracker is used to store the configuration of the kanban board (columns, ordering). The proxy is then used to query all the infomation that is needed to display the board based on the information that is already stored in Redmine. It can also update the ticket when it is moved in the Kanban board by changing its state.
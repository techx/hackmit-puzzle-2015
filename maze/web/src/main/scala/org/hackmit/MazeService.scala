package org.hackmit

import akka.actor.Actor
import spray.routing._
import spray.http._
import MediaTypes._

// we don't implement our route structure directly in the service actor because
// we want to be able to test it independently, without having to spin up an actor
class MazeServiceActor extends Actor with MazeService {

  // the HttpService trait defines only one abstract member, which
  // connects the services environment to the enclosing actor or test
  def actorRefFactory = context

  // this actor only runs our route, but you could add
  // other things here, like request stream processing
  // or timeout handling
  def receive = runRoute(myRoute)
}


// this trait defines our service behavior independently from the service actor
trait MazeService extends HttpService {

  val myRoute = {
    pathPrefix("static") {
      getFromResourceDirectory("static")
    } ~
    path("static" / Rest) { _ =>
      get {
        respondWithMediaType(`text/html`) {
          complete {
            page(sadFace)
          }
        }
      }
    } ~
    path(Rest) { steps =>
      get {
        respondWithMediaType(`text/html`) { // XML is marshalled to `text/xml` by default, so we simply override here
          complete {
            page(process(steps))
          }
        }
      }
    }
  }

  def page(content: scala.xml.Elem) = {
    <html>
      <head>
        <title>Dogesplorer!</title>
        <style>
        {scala.xml.Unparsed("""
          pre {
            font-size: 5em;
            font-family: Menlo, "Courier New", Monaco, monospace;
          }
          a {
            text-decoration: none;
            color: green;
          }
          span {
            color: red;
          }
        """)}
        </style>
      </head>
      <body>
        {content}
      </body>
    </html>
  }

  val sadFace = {
    <pre><span>:(</span></pre>
  }

  def process(steps: String): scala.xml.Elem = {
    import Maze._
    if (!stepsOk(steps)) {
      sadFace
    } else {
      val loc = end(steps)
      val lf = "\n"
      val up = if (upFree(loc)) { <a href={s"/${steps}U"}>-</a> } else { <span>-</span> }
      val down = if (downFree(loc)) { <a href={s"/${steps}D"}>-</a> } else { <span>-</span> }
      val left = if (leftFree(loc)) { <a href={s"/${steps}L"}>|</a> } else { <span>|</span> }
      val right = if (rightFree(loc)) { <a href={s"/${steps}R"}>|</a> } else { <span>|</span> }
      val mid = specialAt(loc) map { case (c, url) =>
        <a href={url}>{c}</a>
      } getOrElse {
        " "
      }
      <pre>+{up}+{lf}{left}{mid}{right}{lf}+{down}+</pre>
    }
  }

}

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
            sadPage
          }
        }
      }
    } ~
    path(Rest) { steps =>
      get {
        respondWithMediaType(`text/html`) { // XML is marshalled to `text/xml` by default, so we simply override here
          complete {
            process(steps)
          }
        }
      }
    }
  }

  def page(center: scala.xml.Elem,
           top: scala.xml.Elem,
           left: scala.xml.Elem,
           right: scala.xml.Elem,
           bottom: scala.xml.Elem) = {
    <html>
      <head>
        <title>Wow!</title>
        <style>
        {scala.xml.Unparsed("""
        pre {
          font-size: 5em;
          font-family: Menlo, "Courier New", Monaco, monospace;
          color: #ff00ff;
        }

        a {
          text-decoration: none;
          color: #00ff00;
        }

        span {
          color: #ff0000;
        }
        .special {
          color: #00ffff;
        }
        #outer {
          /* Vertical Align */
          position: relative;
          top: 50%;
          transform: translateY(-50%);


          /* Horizontally align inner */
          width: 100%;
          display: -moz-box;
          -moz-box-pack: center;
          -moz-box-align: center;
          display: -webkit-box;
          -webkit-box-pack: center;
          -webkit-box-align: center;
          display: box;
          box-pack: center;
          box-align: center;
        }
        #inner {
        }

        div.box {
          width: 100px;
          height: 100px;
          display: inline-block;
          position: relative;
          outline: 10px solid cyan;
          margin: 0;
        }

        .edge.box {
          background: magenta;
        }

        .red.box {
          background: red;
          background: url('/static/reddoge.png');
          background-size: cover;
        }

        .green.box {
          background: #00FF00;
          background: url('/static/greendoge.png');
          background-size: cover;
        }

        .no.box {
          background: red;
          background: url('/static/grumpycat.png');
          background-size: cover;
        }

        .box > .content {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0; right: 0;
          text-align: center;
          font-size: 3em;
        }
        """)}
        </style>
      </head>
      <body>
        <div id="outer">
          <div id="inner">
            <div class="row">
              <div class="edge box"></div>
              { top }
              <div class="edge box"></div>
            </div>
            <div class="row">
              { left }
              <div class="box">
                <div class="content">
                  { center }
                </div>
              </div>
              { right }
            </div>
            <div class="row">
              <div class="edge box"></div>
              { bottom }
              <div class="edge box"></div>
            </div>
          </div>
        </div>
        <script>
        {xml.Unparsed("""
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-63828172-7', 'auto');
          ga('send', 'pageview');"""
        )}
        </script>
      </body>
    </html>
  }

  def box(s: String) = scala.xml.Unparsed(s + " box")

  def div(inner: String): scala.xml.Elem = <div class={{box(inner)}}></div>

  val sadPage = {
    page(<span> </span>, div("no"), div("no"), div("no"), div("no"))
  }

  def process(steps: String): scala.xml.Elem = {
    import Maze._
    if (!stepsOk(steps)) {
      sadPage
    } else {
      val loc = end(steps)
      val lf = "\n"
      val up = if (upFree(loc)) { <a href={s"/${steps}U"}>{div("green")}</a> } else { div("red") }
      val down = if (downFree(loc)) { <a href={s"/${steps}D"}>{div("green")}</a> } else { div("red") }
      val left = if (leftFree(loc)) { <a href={s"/${steps}L"}>{div("green")}</a> } else { div("red") }
      val right = if (rightFree(loc)) { <a href={s"/${steps}R"}>{div("green")}</a> } else { div("red") }
      val mid = specialAt(loc) map { case (c, url) =>
        <a href={url} class="special">{c}</a>
      } getOrElse {
        <span> </span>
      }
      page(mid, up, left, right, down)
    }
  }

}

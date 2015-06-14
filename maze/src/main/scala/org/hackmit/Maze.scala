package org.hackmit

object Maze {

  // let's just put this inline here...
  val mazeStr: String = """
  |##########
  |#*########
  |#   #   ##
  |### # #a##
  |##########
  """.trim.stripMargin

  def isPassable(c: Char) = c != '#'
  def isEmpty(c: Char) = c == ' '
  def isStart(c: Char) = c == '*'
  def isSpecial(c: Char) = special isDefinedAt c
  val special: PartialFunction[Char, String] = {
    case 'a' => "hello"
  }

  val lines: Array[String] = mazeStr split "\n"

  // check representation of maze
  require {
    // more than one line, first line length nonzero
    lines.length > 0 && lines.head.length > 0
  }
  require {
    // all same length
    lines forall { _.length == lines.head.length }
  }
  require {
    // border is all blocked
    (lines.head forall { !isPassable(_) }) &&
    (lines.last forall { !isPassable(_) }) &&
    (lines forall { ln => !isPassable(ln.head) }) &&
    (lines forall { ln => !isPassable(ln.last) })
  }
  require {
    // exactly one start
    (lines count { ln =>
      (ln count isStart) == 1
    }) == 1
  }
  require {
    // everything is well-defined
    lines forall { ln =>
      ln forall { c =>
        !isPassable(c) || isEmpty(c) || isStart(c) || isSpecial(c)
      }
    }
  }

}

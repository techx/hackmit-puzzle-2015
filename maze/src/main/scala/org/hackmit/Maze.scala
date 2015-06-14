package org.hackmit

object Maze {

  // let's just put this inline here...
  val mazeStr: String = """
  |##########
  |#S########
  |#   #   ##
  |###   #*##
  |##########
  """.trim.stripMargin

  def isPassable(c: Char): Boolean = c != '#'
  def isEmpty(c: Char): Boolean = c == ' '
  def isStart(c: Char): Boolean = c == 'S'
  def isSpecial(c: Char): Boolean = special isDefinedAt c
  val special: PartialFunction[Char, String] = {
    case '*' => "https://www.hackmit.org"
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

  val height: Int = lines.length
  val width: Int = lines.head.length
  val start: (Int, Int) = (
    for {
      (line, y) <- lines.zipWithIndex
      (c, x) <- line.zipWithIndex
      if isStart(c)
    } yield (x, y)
  ).head

  def inBounds(loc: (Int, Int)): Boolean = loc match {
    case (x, y) => 0 <= x && x < width && 0 <= y && y < height
  }

  // top left is 0, 0, bottom right is (width - 1, height - 1)
  def charAt(loc: (Int, Int)): Char = loc match {
    case (x, y) => lines(y)(x)
  }

  def move(steps: String): Seq[(Int, Int)] = steps.scanLeft(start) { (pos, step) =>
    step match {
      case 'U' => (pos._1, pos._2 - 1)
      case 'D' => (pos._1, pos._2 + 1)
      case 'L' => (pos._1 - 1, pos._2)
      case 'R' => (pos._1 + 1, pos._2)
      case _ => pos // if there's garbage, we ignore it
    }
  }

  // steps contain L, R, U, D, positions wrt start
  def stepsOk(steps: String): Boolean = {
    val locs = move(steps)
    locs forall { loc =>
      inBounds(loc) && isPassable(charAt(loc))
    }
  }

  def end(steps: String): (Int, Int) = move(steps).last

  def upFree(loc: (Int, Int)): Boolean = {
    val up = (loc._1, loc._2 - 1)
    inBounds(up) && isPassable(charAt(up))
  }
  def downFree(loc: (Int, Int)): Boolean = {
    val down = (loc._1, loc._2 + 1)
    inBounds(down) && isPassable(charAt(down))
  }
  def leftFree(loc: (Int, Int)): Boolean = {
    val left = (loc._1 - 1, loc._2)
    inBounds(left) && isPassable(charAt(left))
  }
  def rightFree(loc: (Int, Int)): Boolean = {
    val right = (loc._1 + 1, loc._2)
    inBounds(right) && isPassable(charAt(right))
  }
  def specialAt(loc: (Int, Int)): Option[(Char, String)] = if (inBounds(loc)) {
    val c = charAt(loc)
    special lift c map { res => (c, res) }
  } else {
    None
  }

}

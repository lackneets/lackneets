<?php

  ini_set('display_errors', true);
  $filename = preg_replace('/\.png(-min)*$/i', '.png', $_SERVER['DOCUMENT_ROOT'] . preg_replace('/\?.+$/', '', $_SERVER['REQUEST_URI']));

  $mindir = dirname($filename) . '/min';
  $minfile = $mindir . '/' . basename($filename, '.png') . '-min.png';
  $minurl = dirname($_SERVER['REQUEST_URI']) . '/min/' . basename($filename, '.png') . '-min.png';

  if(!preg_match('/\.png$/', $filename) or !file_exists($filename)){
    header("HTTP/1.0 404 Not Found"); exit;
  }

  // if mod_rewrite not redirect to minified png
  if(file_exists($minfile)){
    header('location:' . $minurl); exit;
  }


  $cmd = 'pngquant --quality 50-70 -';
  $descriptorspec = array(
    0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
    1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
    2 => array("file", "/tmp/error-output.txt", "a") // stderr is a file to write to
  );
  $process = proc_open($cmd, $descriptorspec, $pipes);

  if (is_resource($process)) {
    fwrite($pipes[0], file_get_contents($filename)); // file_get_contents('php://stdin')
    fclose($pipes[0]);

    $content = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    
    @mkdir(dirname($filename) . '/min', 0777);

    // file_put_contents($minfile, $content);
    // @chmod($minfile, 0777);
    // @touch($minfile, filemtime($filename));

    $minified = $_SERVER['DOCUMENT_ROOT'] . $_SERVER['BASE'] . 'minified/' . substr($_SERVER['REQUEST_URI'], strlen($_SERVER['BASE']));
    @mkdir(dirname($minified), 0777, true); 
    file_put_contents($minified, $content);
    @chmod($minified, 0777);
    @touch($minified, filemtime($filename));

    $return_value = proc_close($process);

    // Use apache internal redirection
    header("Location:" . $_SERVER['REQUEST_URI']); exit;

    // $fs = stat($minfile);
    // header("Last-Modified: ".gmdate("D, d M Y H:i:s", filemtime($minfile))." GMT"); 
    // header("Etag: " . sprintf('"%x-%x-%s"', $fs['ino'], $fs['size'],base_convert(str_pad($fs['mtime'],16,"0"),10,16)));
    // header('Content-type: image/png');
    // echo $content;

  }else{
    $fs = stat($filename);
    header("Last-Modified: ".gmdate("D, d M Y H:i:s", filemtime($filename))." GMT"); 
    header("Etag: " . sprintf('"%x-%x-%s"', $fs['ino'], $fs['size'],base_convert(str_pad($fs['mtime'],16,"0"),10,16)));
    header('Content-type: image/png');
    readfile($filename);
  }
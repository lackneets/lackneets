<?php 
  /*
    Less Auto Compiler
    Author: Lackneets
    Dependency: "npm install less -g"
    Files: .htaccess and lessc.php
  */

  ini_set('display_errors', true);

  $filename = preg_replace('/\.less(\.css)*$/i', '.less', __DIR__ . preg_replace('/\?.+$/', '', $_SERVER['REQUEST_URI']));

  if($filename == __FILE__){
    header("HTTP/1.0 404 Not Found");
    echo "Not Found";
  }else if(file_exists($filename)){
    header("Content-Type: text/css");
    $start = microtime(true);
    // ob_start();
    // system('/usr/bin/lessc --no-color  --no-ie-compat "'.$filename.'" 2>&1');
    // $result = ob_get_clean();
    $result = shell_exec('/usr/bin/lessc --no-color  --no-ie-compat "'.$filename.'" 2>&1');
    if(strpos($result, 'Error:') > 0){
      echo " body{ padding: 0; margin: 0; }
      body:before{ 
        content: \"".escapeResult($result)."\";
        position:relative;
        z-index: 100000;
        font-size: 15px;
        display: block;
        padding: 10px;
        white-space: pre;
        background: #FFE4E1;
        color: #333;
      }";
    }else{
      echo "/* Compiled in " . round(microtime(true)-$start, 3)*1000 . "ms */\n";
      echo $result;
    }
  }else{
    header("HTTP/1.0 404 Not Found");
    echo "Not Found";
  }

  function escapeResult($string){
    $string = preg_replace('/[\n\r]/', '\A ', $string);
    $string = preg_replace('/"/', '\\\"', $string);
    $string = preg_replace('/\'/', '\\\'', $string);
    return preg_replace('/\033\[[0-9;]*m/', '', $string);
  }

?>
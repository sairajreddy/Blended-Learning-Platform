<?php
    $msg =  $_POST['msg'];
    $file = fopen("chat.txt",'w');
    fwrite($file,$msg."\n");
    fclose($file);
?>
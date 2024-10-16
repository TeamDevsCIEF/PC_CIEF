<?php

include_once "connection.php";
/*
echo $_GET['id']."<br />";
echo $_GET['titulo']."<br />";
echo $_GET['descr']."<br />";
echo $_GET['estado']."<br />";
*/

$update = "UPDATE tareas SET titulo = ?, descr = ?, estado = ?, vencimiento = ?, fecha = CURRENT_TIMESTAMP WHERE id = ?";
$update_prepare = $conn->prepare($update);
$update_prepare->execute([$_GET['titulo'], $_GET['descr'], $_GET['estado'], $_GET['vencimiento'], $_GET['id']]);

$update_prepare = null;
$conn = null;

header('location:index.php');

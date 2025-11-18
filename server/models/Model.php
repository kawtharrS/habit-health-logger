<?php
abstract class Model{

    protected static string $table;
    protected int $id;

    public static function find(mysqli $connection, string $id, string $primary_key = "id"){
        $sql = sprintf("SELECT * from %s WHERE %s = ?",
                       static::$table,
                       $primary_key);
                       //static::$primary_key);

        $query = $connection->prepare($sql);
        $query->bind_param("i", $id);
        $query->execute();               

        $data = $query->get_result()->fetch_assoc();

        return $data ? new static($data) : null;
    }

    public static function findAll(mysqli $connection, string $primary_key = "id"){
        //implement this
        $sql = sprintf("SELECT * from %s",
                       static::$table,
                       $primary_key);
                       //static::$primary_key);

        $query = $connection->prepare($sql);
        $query->execute();
        $res = $query->get_result();

        $items = [];
        while ($data = $res->fetch_assoc()){
           $items[] = new static($data);
    }
        return $items;
    }

    public static function create(mysqli $connection, array $data){
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));

        $sql = sprintf("INSERT INTO %s ($columns) VALUES ($placeholders)", static::$table);

        $types = '';
        $params = [];

        foreach ($data as $value)
        {
            if(is_int($value))
                $types .= 'i';
            else
                $types .= 's';
            $params[] = $value;
        }

        $query = $connection->prepare($sql);
        $query->bind_param($types, ...$params);

        if($query->execute()){
            $id = $connection->insert_id;  
            return new static(array_merge(["id" => $id], $data));  
        }

        return false;
    }


    public function delete(mysqli $connection, string $primary_key = "id")
    {
        $sql = sprintf("DELETE FROM %s WHERE %s = ?", static::$table, $primary_key);
        $query = $connection->prepare($sql);
        $query->bind_param('s', $this->id);
        $query->execute();
        if($query->affected_rows >0)
        {
            return true;
        }
        return false;
    }

    public function update(mysqli $connection, array $data){
        $column = implode(', ', array_map(fn($key) => "$key = ?", array_keys($data)));

        $sql = sprintf("UPDATE %s SET $column WHERE id = ?", static::$table);

        $types = '';
        $params = [];

        foreach ($data as $value)
        {
            if(is_int($value))
                $types .= 'i';
            else
                $types .= 's';
            $params[] = $value;
        }

        $types .= 's';
        $params[] = $this->id;

        $query = $connection->prepare($sql);
        $query->bind_param($types, ...$params);
        if($query -> execute()){
            return true;
        }
        return false;
    }

    public static function where(mysqli $connection, array $conditions): array
    {
        $sql =sprintf("SELECT * FROM %s WHERE ", static::$table);

        $clauses = [];
        $values = [];
        $types = "";

        foreach ($conditions as $column => $value) {
            $clauses[] = "$column = ?";
            $values[] = $value;
            $types .= is_int($value) ? "i" : "s";
        }

        $sql .= implode(" AND ", $clauses);

        $query = $connection->prepare($sql);
        $query->bind_param($types, ...$values);
        $query->execute();
        $result = $query->get_result();

        $objects = [];
        while ($row = $result->fetch_assoc()) {
            $objects[] = new static($row);
        }

        return $objects;
    }

}





?>
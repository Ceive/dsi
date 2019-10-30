<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi;
use Ceive\Dsi\Type\Scalar\TypeFloat;
use Ceive\Dsi\Type\Scalar\TypeInteger;
use Ceive\Dsi\Type\Scalar\TypeNumeric;
use Ceive\Dsi\Type\Scalar\TypeString;
use Ceive\Dsi\Type\TypeArray;
use Ceive\Dsi\Type\TypeObject;
use Ceive\Dsi\Type\TypeScalar;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class Type
 * @package Ceive\Dsi
 */
abstract class Type{
	
	/**
	 * @param $value
	 * @return bool
	 */
	abstract public function check($value);
	
	
	public static function getString(){
		return new TypeString();
	}
	
	public static function getScalar(){
		return new TypeScalar();
	}
	
	public static function getObject(){
		return new TypeObject();
	}
	
	public static function getArray(){
		return new TypeArray();
	}
	
	
	public static function getNumber(){
		return new TypeNumeric();
	}
	
	public static function getFloat(){
		return new TypeString();
	}
	
	public static function getInteger(){
		return new TypeInteger();
	}
	
	public static function getAny(){
		return new TypeFloat();
	}
	
}



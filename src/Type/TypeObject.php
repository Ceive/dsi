<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type;

use Ceive\Dsi\Autocomplete\ObjectInWay;
use Ceive\Dsi\Member;
use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeObject
 * @package Ceive\Dsi\Type
 */
class TypeObject extends Type{
	
	/** @var  string|null */
	public $classname;
	
	/** @var Member[] */
	public $members = [];
	
	/** @var bool  */
	public $extraAllowed = false;
	
	/**
	 * TypeObject constructor.
	 * @param null $classname
	 */
	public function __construct($classname = null, $extraPropertiesAllowed = false){
		$this->classname = $classname;
		$this->extraAllowed = $extraPropertiesAllowed;
	}
	
	
	/**
	 * @param $classname
	 * @return $this
	 */
	public function setClassname($classname = null){
		$this->classname = $classname;
		return $this;
	}
	
	/**
	 * @param $key
	 * @param Member $member
	 * @return $this
	 */
	public function setMember($key, Member $member){
		$this->members[$key] = $member;
		return $this;
	}
	
	/**
	 * @param $key
	 * @param bool $autocreate
	 * @return Member|null
	 */
	public function getMember($key, $autocreate = true){
		if(!isset($this->members[$key])){
			if($autocreate){
				$this->members[$key] = new Member();
			}else{
				return null;
			}
		}
		return $this->members[$key];
	}
	
	function __get($name){
		return $this->getMember($name);
	}
	
	function __set($name, $value){
		$this->setMember($name, $value);
	}
	
	function __isset($name){
		return isset($this->members[$name]);
	}
	
	function __unset($name){
		unset($this->members[$name]);
	}
	
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		if(!is_object($value)){
			return false;
		}
		
		if($this->classname && !is_a($value, $this->classname)){
			return false;
		}
		
		return $this->_checkMembers($value);
	}
	
	
	/**
	 * @param $object
	 * @return bool
	 */
	protected function _checkMembers($object){
		foreach($this->getMembers() as $key => $member){
			if(!$this->_checkMember($object, $key, $member)){
				return false;
			}
		}
		return true;
	}
	
	/**
	 * @param $container
	 * @param $key
	 * @param Member $member
	 * @return bool
	 */
	protected function _checkMember($container, $key, Member $member){
		if(property_exists($container, $key)){
			if(!$member->check($container->{$key})){
				return false;
			}
		}else{
			if(method_exists($container,'__get')){
				if(method_exists($container,'__isset') && !$container->__isset($key)){
					return false;
				}
				if(!$member->check($container->__get($key))){
					return false;
				}
			}else{
				return false;
			}
		}
		return true;
	}
	
	public function export(){
		$a = [];
		
		
		foreach($this->members as $key => $member){
			
			$a[$key] = $member->export();
			
		}
		
	}
	
	/**
	 * @return Member[]
	 */
	public function getMembers(){
		return $this->members;
	}
	
	/**
	 * @param array $members
	 * @param bool $merge
	 * @return $this
	 */
	public function setMembers(array $members, $merge = false){
		$this->members = $merge ? array_replace($this->members, $members) : $members;
		return $this;
	}
}



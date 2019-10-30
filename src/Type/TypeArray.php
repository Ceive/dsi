<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type;

use Ceive\Dsi\Member;
use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeArray
 * @package Ceive\Dsi\Type
 */
class TypeArray extends TypeObject{
	
	/** @var Member */
	protected $each;
	
	/**
	 * TypeArray constructor.
	 */
	public function __construct(){
		parent::__construct(null);
	}
	
	/**
	 * @param null $classname
	 * @return $this
	 */
	public function setClassname($classname = null){
		parent::setClassname(null);
		return $this;
	}
	
	/**
	 * @param Member $types
	 * @return $this
	 */
	public function setEach(Member $types){
		$this->each = $types;
		return $this;
	}
	
	/**
	 * @return Member
	 */
	public function getEach(){
		return $this->each;
	}
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		if(!is_array($value)){
			return false;
		}
		return $this->_checkEach($value) && $this->_checkMembers($value);
	}
	
	/**
	 * @param $value
	 * @return bool
	 */
	protected function _checkEach($value){
		if($this->each){
			foreach($value as $item){
				if(!$this->each->check($item)){
					return false;
				}
			}
		}
		return true;
	}
	
	/**
	 * @param $value
	 * @return bool
	 */
	protected function _checkMembers($value){
		foreach($this->members as $key => $member){
			if(array_key_exists($key, $value) && !$member->check($value[$key])){
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
		return array_key_exists($key, $container) && !$member->check($container[$key]);
	}
	
	
}



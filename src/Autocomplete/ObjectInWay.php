<?php
/**
 * @Creator Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Author: Alexey Kutuzov <lexus27.khv@gmai.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Autocomplete;

use Ceive\Dsi\Member;
use Ceive\Dsi\Type\TypeObject;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class ObjectInWay
 * @package Ceive\Dsi\Autocomplete
 */
class ObjectInWay extends TypeObject{
	
	/** @var  string[] */
	protected $locations = [];
	
	/**
	 * AutocompleteLocation constructor.
	 * @param null $locations
	 * @param Member[] $members
	 * @internal param array $attributes
	 */
	public function __construct($locations = null, array $members = []){
		if(is_null($locations)){
			$locations = [];
		}
		$this->setLocation($locations);
		$this->setMembers($members);
	}
	
	
	/**
	 * @param $locations
	 * @return bool
	 */
	public function hasLocation($locations){
		if(!is_array($locations)){
			$locations = [$locations];
		}
		return array_intersect($this->locations, $locations) == $locations;
	}
	
	/**
	 * @param string|string[] $locations
	 * @param bool $merge
	 * @return $this
	 */
	public function setLocation($locations, $merge = false){
		if(!is_array($locations)){
			$locations = [$locations];
		}
		$this->locations = array_unique( $merge? array_merge($this->locations, $locations): $locations );
		return $this;
	}
	
}



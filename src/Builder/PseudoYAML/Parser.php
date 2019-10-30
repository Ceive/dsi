<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Builder\PseudoYAML;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class Parser
 * @package Ceive\Dsi\Builder\PseudoYAML
 */
class Parser{
	
	/** @var  Nester */
	public $nester;
	public $lines = [];
	public $i = 0;
	
	public $indent_char = "\t";
	
	/**
	 * @param $string
	 * @return Nester
	 */
	public function parse($string){
		
		$this->nester = new Nester($this);
		$this->nester->indent_char = $this->indent_char;
		
		$this->lines = explode("\r\n",$string);
		$this->i = 0;
		$this->nester->process();
		
		return $this->nester;
	}
	
	/**
	 * @param Nester $nester
	 * @return array
	 */
	public function exportNester(Nester $nester){
		$a = [];
		foreach($nester->attributes as $k => $v){
			if($v instanceof Nester){
				$a[$k] = $this->exportNester($v);
			}else{
				$a[$k] = $v;
			}
		}
		return $a;
	}
	
	public function getLineOffset($offset = 0){
		return isset($this->lines[$this->i + $offset])?$this->lines[$this->i + $offset]:null;
	}
	
	
	public function rewind(){
		$this->i=0;
	}
	
	/**
	 * @param int $increment
	 */
	public function next($increment = 1){
		$this->i+= $increment;
	}
	
	public function valid(){
		return isset($this->lines[$this->i]);
	}
	
	public function current(){
		return isset($this->lines[$this->i])?$this->lines[$this->i]:null;
	}
	
	/**
	 * @param null $value
	 * @return bool
	 */
	public function isEmpty($value = null){
		if(is_null($value))$value = $this->current();
		return !$value || !trim($value);
	}
	
	/**
	 * @param $value
	 * @return array
	 */
	public function decomposite($value){
		list($name, $value) = array_replace([null,null],explode(':', $value));
		$name = $name?trim($name):null;
		$value = $value?trim($value):null;
		return [$name, $value];
	}
	
	
	/**
	 * @param Nester $parent
	 * @param $key
	 * @param $value
	 * @return Nester
	 */
	public function createInner(Nester $parent, $key, $value){
		$dumper= new Nester($this, $parent);
		$dumper->key = $key;
		$dumper->value = $value;
		return $dumper;
	}
	
	public function processedInner(Nester $inner, $key, $value){
		
	}
	
}



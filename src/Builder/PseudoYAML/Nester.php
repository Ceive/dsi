<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Builder\PseudoYAML;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class Nester
 * @package Ceive\Dsi\Builder\PseudoYAML
 */
class Nester{
	
	/** @var Nester  */
	public $parent;
	
	/** @var Parser  */
	public $parser;
	
	/** @var int  */
	public $nesting_level = 0;
	
	/** @var string  */
	public $indent_char = "\t";
	
	public $key;
	
	public $value;
	
	public $attributes = [];
	
	
	/**
	 * Nester constructor.
	 * @param Nester $parent
	 * @param Parser $parser
	 */
	public function __construct( Parser $parser, Nester $parent = null){
		$this->parent = $parent;
		$this->parser = $parser;
		$this->nesting_level = $this->parent?$this->parent->nesting_level + 1 : 0 ;
	}
	
	/**
	 * @return array
	 */
	public function process(){
		for(;$this->parser->valid();$this->parser->next()){
			if(!$this->parser->isEmpty()){
				$this->initialize();
				
				$line = $this->parser->current();
				$value = $this->getValue($line);
				if($value === false){
					$this->parser->next(-1);
					return $this->attributes;
				}
				
				list($key, $value) = $this->decomposite($value);
				
				if( ($innerNextOffset=$this->hasInner()) !==false){
					$inner = $this->createInner($key, $value);
					$inner->key = $key;
					$inner->value = $value;
					$this->parser->next($innerNextOffset);
					$inner->process();
					$this->processedInner($inner, $key, $value);
					$this->set($key, $inner);
				}else{
					$this->set($key, $value);
				}
			}
		}
		return $this->attributes;
	}
	
	/**
	 * @param $key
	 * @param $value
	 */
	public function set($key, $value){
		$this->attributes[$key] = $value;
	}
	
	/**
	 * @param $key
	 * @param $value
	 * @return Nester
	 */
	public function createInner($key, $value){
		return $this->parser->createInner($this,$key,$value);
	}
	
	/**
	 * @param Nester $inner
	 * @param $key
	 * @param $value
	 */
	public function processedInner(Nester $inner, $key, $value){
		$this->parser->processedInner($inner,$key,$value);
	}
	
	/**
	 * @return bool|int
	 */
	public function hasInner(){
		$i = 1;$level = $this->nesting_level + 1;
		while(true){
			$line = $this->parser->getLineOffset($i);
			if($this->parser->isEmpty($line)){
				$i++;
				continue;
			}
			$value = $this->getValue($line, $level);
			if($value!=false){
				return $i;
			}else{
				break;
			}
		}
		return false;
	}
	
	/**
	 * @param $line
	 * @return bool
	 */
	public function isEmpty($line){
		return !$line || trim($line) === '';
	}
	
	/**
	 * @param $line
	 * @param null $level
	 * @return bool|string
	 */
	public function getValue($line, $level = null){
		if($this->getCurrentIndentation($line, $level) !== $this->getExpectedIndentation($level)){
			return false;
		}
		
		$pos = $this->nesting_level * strlen($this->indent_char);
		return substr($line, $pos);
	}
	
	
	/**
	 * @param null $level
	 * @return string
	 */
	public function getExpectedIndentation($level = null){
		return str_repeat($this->indent_char,is_int($level)?$level:$this->nesting_level);
	}
	
	/**
	 * @param $line
	 * @param null $level
	 * @return string
	 */
	public function getCurrentIndentation($line, $level = null){
		return substr($line, 0, is_int($level)?$level:$this->nesting_level * strlen($this->indent_char));
	}
	
	/**
	 * @param $value
	 * @return array
	 */
	public function decomposite($value){
		return $this->parser->decomposite($value);
	}
	
	protected $initialized = false;
	
	public function initialize(){
		if(!$this->initialized){
			$this->initialized = true;
			$line = $this->parser->current();
			$indent = null;
			$level = $this->nesting_level;
			$chars = ["\t"," "];
			
			$offset = ($this->parent?strlen($this->parent->indent_char):0) * $level;
			
			while(($char = substr($line,$offset, 1)) && in_array($char, $chars, true)){
				if(!$indent){
					$indent = $char;
				}elseif($indent!==$char){
					break;
				}else{
					$offset+=strlen($indent);
					$level++;
				}
			}
			$this->indent_char = $indent?:($this->parent?$this->parent->indent_char:$this->indent_char);
			$this->nesting_level = $level;
		}
	}
	
	
	
}



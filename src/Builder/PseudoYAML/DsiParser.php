<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Builder\PseudoYAML;

use Ceive\Dsi\Builder\TypeAny;
use Ceive\Dsi\Member;
use Ceive\Dsi\Type;
use Ceive\Dsi\Type\Scalar\TypeFloat;
use Ceive\Dsi\Type\Scalar\TypeInteger;
use Ceive\Dsi\Type\Scalar\TypeNumeric;
use Ceive\Dsi\Type\Scalar\TypeString;
use Ceive\Dsi\Type\TypeArray;
use Ceive\Dsi\Type\TypeObject;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class DsiParser
 * @package Ceive\Dsi\Builder\PseudoYAML
 */
class DsiParser extends Parser{
	
	
	/**
	 * @param $string
	 * @return Type
	 */
	public function parse($string){
		$nester = parent::parse($string);
		return $this->exportNester($nester);
	}
	
	
	public $scalars = [
		'string',
		'integer',
		'float',
		'null'
	];
	
	/**
	 * @param Nester|null $nester
	 * @param null $typename
	 * @return Type
	 */
	public function exportNester(Nester $nester, $typename = null){
		return $this->getType($typename?:'object', $nester);
	}
	
	/**
	 * @param $key
	 * @param $value
	 * @return array
	 */
	public function createMember($key, $value){
		$member = new Member();
		
		if($value instanceof Nester){
			$inner = $value;
			$value = $inner->value;
			
			list($key, $types) = $this->decompositeTypes($key, $value, $this->normalizeTypes($value));
			$array = null;
			foreach($types as $type){
				if($type === 'null'){
					$member->setNullable(true);
				}else{
					if(in_array($type,['[]','arr','array','list'])){
						$array = $this->getType($type, null);
						$member->addType( $array );
					}
					
				}
			}
			$innerTypes = [];
			foreach($inner->attributes as $innerKey => $innerVal){
				if(strpos($innerKey,'-')!==0){
					$innerTypes = false;
					break;
				}
				$innerKey = substr($innerKey,1);
				
				if(!$innerVal){
					foreach($this->normalizeTypes($innerKey) as $innerKey){
						$innerTypes[] = $this->getType($innerKey, null);
					}
				}else{
					$innerTypes[] = $this->getType($innerKey, $innerVal);
				}
			}
			if($array instanceof TypeArray){
				if($innerTypes === false){
					$innerTypes = [
						$this->getType('object', $inner)
					];
				}
				$m = new Member();
				$array->setEach( $m );
				foreach($innerTypes as $innerType){
					$m->addType( $innerType );
				}
			}elseif($innerTypes === false){
				if($inner->attributes){
					$member->addType( $this->getType('object', $inner ) );
				}
			}else{
				foreach($innerTypes as $innerType){
					$member->addType( $innerType );
				}
			}
		}else{
			$inner = null;
			list($key, $types) = $this->decompositeTypes($key, null, $this->normalizeTypes($value));
			if($types){
				foreach($types as $type){
					if($type === 'null'){
						$member->setNullable(true);
					}else{
						$member->addType( $this->getType($type, null) );
					}
				}
			}else{
				$member->addType( $this->getType(null, null) );
			}
			
		}
		return [$key, $member];
	}
	
	/**
	 * @param $types
	 * @return array
	 */
	public function normalizeTypes($types){
		if(!is_array($types)){
			$types = explode('|',$types);
		}
		return array_filter(array_unique(array_map('trim',$types)));
	}
	
	/**
	 * @param $key
	 * @param $value
	 * @param array $types
	 * @return array
	 */
	public function decompositeTypes($key, $value=null, $types = []){
		
		if(strpos($key,'{}')!==false){
			$key = substr($key,0,-2);
			$types[] = '{}';
		}elseif(strpos($key,'[]')!==false){
			$key = substr($key,0,-2);
			$types[] = '[]';
		}
		return [$key, $types];
	}
	
	/**
	 * @param $name
	 * @param $inner
	 * @return Type
	 */
	public function getType($name, $inner){
		switch($name){
			case null:
			case 'any':
				return new TypeAny();
				break;
				
			case 'string':
			case 'str':
			case 'text':
				return new TypeString();
				break;
				
			case 'int':
			case 'integer':
				return new TypeInteger();
				break;
				
			case 'float':
			case 'double':
				return new TypeFloat();
				break;
				
			case 'number':
			case 'numeric':
				return new TypeNumeric();
				break;
				
			case 'arr':
			case 'array':
			case 'list':
			case '[]':
				$object = new TypeArray();
				if($inner instanceof Nester){
					list($k, $m) = $this->createMember(null, $inner);
					$object->setEach($m);
				}
				return $object;
				break;
			
			default:
				list($key, $types) = $this->decompositeTypes($name);
				if(count($types)==1 && $types[0]==='[]'){
					$t = $this->getType($types[0], null);
					if($t instanceof TypeArray){
						$m = new Member();
						$m->addType($this->getType($key, null));
						$t->setEach($m);
						return $t;
					}
				}else{
					$object = new TypeObject();
					$object->setClassname($name);
					if($inner instanceof Nester){
						foreach($inner->attributes as $k => $v){
							list($k, $member) = $this->createMember($k, $v);
							$object->setMember($k, $member);
						}
					}
					return $object;
				}
				break;
		}
	}
	
}



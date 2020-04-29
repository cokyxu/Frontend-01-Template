# 第三周总结

### JavaScript 对象

> 此坑较大

- Bound Function Exotic Objects

    Internal Slots

    - [[BoundTargetFunction]]

        可以调用的对象 -- The wrapped function object.

    - [[BoundThis]]

        任何类型 -- The value that is always passed as the this value when calling the wrapped function.

    - [[BoundArguments]]

        任何 List 类型（Argument）-- A list of values whose elements are used as the first arguments to any call to the wrapped function.

    internal methods

    - [[Call]] ( thisArgument, argumentsList )
    - [[Construct]] ( argumentsList, newTarget )
    - BoundFunctionCreate ( targetFunction, boundThis, boundArgs )

- Array Exotic Objects

    internal methods

    - [[DefineOwnProperty]] ( P, Desc )
    - ArrayCreate ( length [ , proto ] )
    - ArraySpeciesCreate ( originalArray, length )
    - ArraySetLength ( A, Desc )

- String Exotic Objects

    internal methods

    - [[GetOwnProperty]] ( P )
    - [[DefineOwnProperty]] ( P, Desc )
    - [[OwnPropertyKeys]] ( )
    - StringCreate ( value, prototype )
    - StringGetOwnProperty ( S, P )

- Arguments Exotic Objects

    internal methods

    - [[GetOwnProperty]] ( P )
    - [[DefineOwnProperty]] ( P, Desc )
    -  [[Get]] ( P, Receiver )
    - [[Set]] ( P, V, Receiver )
    - [[Delete]] ( P )
    - CreateUnmappedArgumentsObject ( argumentsList )
    - CreateMappedArgumentsObject ( func, formals, argumentsList, env )
    - MakeArgGetter ( name, env )
    - MakeArgSetter ( name, env )

- Integer-Indexed Exotic Objects

    internal methods

    - [[GetOwnProperty]] ( P )
    -  [[HasProperty]] ( P )
    - [[DefineOwnProperty]] ( P, Desc )
    - [[Get]] ( P, Receiver )
    - [[Set]] ( P, V, Receiver )
    - [[OwnPropertyKeys]] ( )
    - IntegerIndexedObjectCreate ( prototype, internalSlotsList )
    - IntegerIndexedElementGet ( O, index )
    -  IntegerIndexedElementSet ( O, index, value )

- Module Namespace Exotic Objects

    internal methods

    - [[SetPrototypeOf]] ( V )
    - [[IsExtensible]] ( )
    - [[PreventExtensions]] ( )
    - [[GetOwnProperty]] ( P )
    - [[DefineOwnProperty]] ( P, Desc )
    - [[HasProperty]] ( P )
    - [[Get]] ( P, Receiver )
    - [[Set]] ( P, V, Receiver )
    - [[Delete]] ( P )
    -  [[OwnPropertyKeys]] ( )
    - ModuleNamespaceCreate ( module, exports )

-  Immutable Prototype Exotic Objects

    inernal methods